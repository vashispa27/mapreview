import { db } from "@/lib/db"
import { getCurrentFY, calculateGST } from "@/lib/gym-utils"

interface CreatePaymentArgs {
  siteId: string
  memberId: string
  memberName: string
  memberPhone: string
  memberEmail: string | null
  planTitle: string
  durationMonths: number
  pricePerMonth: number
  type: "enrollment" | "renewal"
}

export async function createGymPayment(args: CreatePaymentArgs) {
  const fy = getCurrentFY()
  const taxableAmount = parseFloat((args.durationMonths * args.pricePerMonth).toFixed(2))

  return await db.$transaction(async (tx) => {
    // Get current settings (or create defaults)
    let settings = await tx.gymSettings.findUnique({ where: { siteId: args.siteId } })

    let counter: number
    if (!settings) {
      settings = await tx.gymSettings.create({
        data: { siteId: args.siteId, invoiceCounter: 1, currentFY: fy },
      })
      counter = 1
    } else if (settings.currentFY !== fy) {
      // New financial year — reset counter
      settings = await tx.gymSettings.update({
        where: { siteId: args.siteId },
        data: { invoiceCounter: 1, currentFY: fy },
      })
      counter = 1
    } else {
      settings = await tx.gymSettings.update({
        where: { siteId: args.siteId },
        data: { invoiceCounter: { increment: 1 } },
      })
      counter = settings.invoiceCounter
    }

    const prefix = settings.invoicePrefix || "INV"
    const invoiceNumber = `${prefix}/${fy}/${String(counter).padStart(4, "0")}`

    const isInterstate = false
    const { cgst, sgst, igst } = calculateGST(taxableAmount, isInterstate)
    const totalAmount = parseFloat((taxableAmount + cgst + sgst + igst).toFixed(2))

    return tx.gymPayment.create({
      data: {
        siteId: args.siteId,
        memberId: args.memberId,
        invoiceNumber,
        financialYear: fy,
        memberName: args.memberName,
        memberPhone: args.memberPhone,
        memberEmail: args.memberEmail,
        planTitle: args.planTitle,
        durationMonths: args.durationMonths,
        taxableAmount,
        cgst,
        sgst,
        igst,
        totalAmount,
        isInterstate,
        type: args.type,
      },
    })
  })
}

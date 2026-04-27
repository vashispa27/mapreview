"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Users,
  Dumbbell,
  Activity,
  IndianRupee,
  Settings,
  Search,
  Plus,
  Check,
  Clock,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  X,
  Download,
  AlertTriangle,
  Trash2,
  Send,
  Bell,
  Globe,
  Monitor,
  Smartphone
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

const initialMembers = [
  { id: 1, name: "Rahul Sharma", phone: "+91 98765 43210", plan: "3 Months", status: "Active", expiry: "20 May" },
  { id: 2, name: "Amit Patel", phone: "+91 87654 32109", plan: "1 Month", status: "Expiring", expiry: "Tomorrow" },
  { id: 3, name: "Suresh Kumar", phone: "+91 76543 21098", plan: "12 Months", status: "Active", expiry: "15 Oct" },
  { id: 4, name: "Priya Singh", phone: "+91 99887 76655", plan: "6 Months", status: "Active", expiry: "12 Aug" },
  { id: 5, name: "Vikram Mehra", phone: "+91 88776 65544", plan: "1 Month", status: "Expired", expiry: "2 Days ago" },
]

const initialWorkouts = [
  { id: 1, name: "push pull legs", sessions: "1 session", goal: "Weight Loss" },
  { id: 2, name: "Full Body Blast", sessions: "3 sessions", goal: "Muscle Gain" },
  { id: 3, name: "Morning Cardio", sessions: "5 sessions", goal: "Stamina" },
]

const initialDiets = [
  { id: 1, name: "High Protein Veg", type: "Vegetarian", calories: "2200 kcal" },
]

export function InteractiveConsoleWidget() {
  const [activeTab, setActiveTab] = useState("members")
  const [isWebsiteView, setIsWebsiteView] = useState(false)
  const [members] = useState(initialMembers)

  return (
    <div className="w-full max-w-4xl mx-auto perspective-1000 relative min-h-[500px] md:min-h-[600px]">
      <motion.div
        animate={{ rotateY: isWebsiteView ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        style={{ transformStyle: "preserve-3d" }}
        className="w-full h-full relative"
      >
        {/* Front Side: Gym Console */}
        <Card 
          style={{ backfaceVisibility: "hidden" }}
          className="bg-[#f8fafc] border-border shadow-2xl overflow-hidden border-2 min-h-[500px] md:min-h-[600px] flex flex-col"
        >
          {/* Top Header */}
          <div className="bg-white px-3 md:px-4 py-3 border-b border-border flex items-center justify-between gap-3">
            {/* Left: gym identity + description */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-[#22c55e] flex items-center justify-center text-white shrink-0">
                <Dumbbell className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[13px] md:text-sm text-foreground truncate">Dynamo Fitness Gym</span>
                  <Badge className="bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0] text-[8px] font-bold shrink-0 shadow-none px-1.5">FREE</Badge>
                </div>
                <p className="text-[10px] text-muted-foreground truncate">Members · Earnings · Billing · All in one place</p>
              </div>
            </div>

            {/* Right: mini browser preview CTA */}
            <button
              onClick={() => setIsWebsiteView(true)}
              className="shrink-0 flex flex-col rounded-xl overflow-hidden border-2 border-[#22c55e] shadow-lg shadow-[#22c55e]/20 hover:shadow-[#22c55e]/40 hover:scale-[1.03] active:scale-95 transition-all group"
              style={{ width: 120 }}
            >
              {/* Browser chrome */}
              <div className="bg-[#f1f5f9] px-2 py-1 flex items-center gap-1 border-b border-[#e2e8f0]">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 shrink-0" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e] shrink-0" />
                <div className="flex-1 bg-white rounded text-[7px] text-[#94a3b8] px-1.5 py-px ml-1 truncate">dynamofitness.in</div>
              </div>
              {/* Mini website preview */}
              <div className="bg-gradient-to-b from-[#1e293b] to-[#0f172a] px-2 py-2 flex flex-col gap-1">
                <div className="w-3/4 h-1 bg-white/50 rounded-full" />
                <div className="w-1/2 h-0.5 bg-white/30 rounded-full" />
                <div className="w-1/3 h-3 bg-[#22c55e]/80 rounded mt-0.5" />
              </div>
              {/* Label */}
              <div className="bg-[#22c55e] px-2 py-1.5 flex items-center justify-center gap-1">
                <span className="text-[10px] font-bold text-white">See free website</span>
                <ChevronRight className="w-3 h-3 text-white group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white px-4 border-b border-border overflow-x-auto text-nowrap scrollbar-hide">
            <div className="flex gap-6 md:gap-8 min-w-max">
              {[
                { id: "members", label: "Members", icon: Users },
                { id: "workouts", label: "Workouts", icon: Activity },
                { id: "earnings", label: "Earnings", icon: IndianRupee },
                { id: "gst", label: "GST", icon: Settings },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 md:gap-2 py-3 md:py-4 text-[12px] md:text-sm font-semibold transition-all relative ${
                    activeTab === tab.id ? "text-[#22c55e]" : "text-[#64748b] hover:text-[#22c55e]"
                  }`}
                >
                  <tab.icon className="w-3.5 md:w-4 h-3.5 md:h-4" />
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-[2px] md:h-[3px] bg-[#22c55e] rounded-t-full"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-4 md:p-6 overflow-y-auto overflow-x-hidden relative">
            <AnimatePresence mode="wait">
              {activeTab === "members" && (
                <motion.div
                  key="members"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4 md:space-y-6 max-w-full"
                >
                  {/* Stat Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                    {[
                      { label: "TOTAL", value: members.length, color: "bg-[#f1f5f9] text-[#1e293b]", icon: Users },
                      { label: "ACTIVE", value: members.filter(m => m.status === "Active").length, color: "bg-[#f0fdf4] text-[#166534]", icon: Check },
                      { label: "EXPIRING", value: members.filter(m => m.status === "Expiring").length, color: "bg-[#fffbeb] text-[#854d0e]", icon: Clock },
                      { label: "EXPIRED", value: members.filter(m => m.status === "Expired").length, color: "bg-[#fef2f2] text-[#991b1b]", icon: AlertCircle },
                    ].map((stat) => (
                      <div key={stat.label} className={`${stat.color} p-3 md:p-4 rounded-xl md:rounded-2xl border border-black/5`}>
                        <div className="flex items-center gap-1.5 md:gap-2 mb-1 md:mb-2">
                          <stat.icon className="w-3 md:w-3.5 h-3 md:h-3.5 opacity-60" />
                          <span className="text-[8px] md:text-[10px] font-bold tracking-wider uppercase opacity-80">{stat.label}</span>
                        </div>
                        <p className="text-xl md:text-3xl font-black">{stat.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Filter Row */}
                  <div className="flex flex-col gap-3 md:gap-4 md:flex-row md:items-center justify-between">
                    <div className="relative flex-1 w-full">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input className="pl-10 h-10 bg-white border-border rounded-lg text-sm" placeholder="Search members..." />
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto min-w-max pb-1 md:pb-0 scrollbar-hide">
                      <Button variant="secondary" className="bg-[#22c55e] text-white hover:bg-[#16a34a] h-9 md:h-10 px-3 md:px-4 rounded-lg font-bold text-xs md:text-sm">All</Button>
                      <Button variant="ghost" className="h-9 md:h-10 px-3 md:px-4 rounded-lg text-xs md:text-sm font-semibold text-[#64748b]">Active</Button>
                      <Button variant="ghost" className="h-9 md:h-10 px-3 md:px-4 rounded-lg text-xs md:text-sm font-semibold text-[#64748b]">Expiring</Button>
                      <Button 
                        disabled
                        className="bg-[#22c55e] opacity-50 text-white h-9 md:h-10 px-3 md:px-4 rounded-lg font-bold shadow-sm flex items-center gap-2 ml-1 cursor-not-allowed text-xs md:text-sm"
                      >
                        <Plus className="w-3.5 md:w-4 h-3.5 md:h-4" /> <span className="hidden sm:inline">Add Member</span><span className="sm:hidden">Add</span>
                      </Button>
                    </div>
                  </div>

                  {/* Member List */}
                  <div className="space-y-2 md:space-y-3">
                    {members.map((m) => (
                      <motion.div
                        key={m.id}
                        layout
                        className="bg-white p-3 md:p-4 rounded-xl border border-border shadow-sm flex items-center justify-between hover:border-primary/50 transition-all group"
                      >
                        <div className="flex items-center gap-3 md:gap-4">
                          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#f1f5f9] flex items-center justify-center text-[#64748b] font-bold uppercase text-[10px] md:text-xs">
                            {m.name.split(" ").map(n => n[0]).join("")}
                          </div>
                          <div>
                            <p className="font-bold text-xs md:text-sm truncate max-w-[100px] md:max-w-none">{m.name}</p>
                            <p className="text-[10px] md:text-xs text-muted-foreground">{m.phone}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 md:gap-4">
                          <div className="flex md:hidden lg:group-hover:flex items-center gap-1.5 md:gap-2 mr-1 md:mr-4">
                            <Button size="sm" variant="outline" className="h-7 md:h-8 px-2 md:px-3 text-[9px] md:text-[10px] font-bold border-primary/20 text-primary hover:bg-primary/5 rounded-lg flex items-center gap-1">
                              <Send className="w-2.5 md:w-3 h-2.5 md:h-3" /> <span className="hidden xs:inline">Plan</span>
                            </Button>
                            <Button size="sm" variant="outline" className="h-7 md:h-8 px-2 md:px-3 text-[9px] md:text-[10px] font-bold border-amber-200 text-amber-600 hover:bg-amber-50 rounded-lg flex items-center gap-1">
                              <Bell className="w-2.5 md:w-3 h-2.5 md:h-3" /> <span className="hidden xs:inline">Remind</span>
                            </Button>
                          </div>

                          <div className="flex items-center gap-4 md:gap-8">
                            <div className="hidden sm:block">
                              <p className="text-[8px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Plan</p>
                              <p className="text-[10px] md:text-xs font-semibold">{m.plan}</p>
                            </div>
                            <div className="text-right min-w-[60px] md:min-w-[80px]">
                              <Badge className={`text-[8px] md:text-[10px] px-1 md:px-1.5 ${
                                m.status === "Active" 
                                ? "bg-[#f0fdf4] text-[#166534] border-[#dcfce7] shadow-none" 
                                : m.status === "Expiring"
                                ? "bg-[#fffbeb] text-[#854d0e] border-[#fef3c7] shadow-none"
                                : "bg-[#fef2f2] text-[#991b1b] border-[#fee2e2] shadow-none"
                              }`}>
                                {m.status}
                              </Badge>
                              <p className="text-[8px] md:text-[10px] text-muted-foreground mt-0.5 md:mt-1 uppercase font-bold tracking-tighter">Exp: {m.expiry}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "workouts" && (
                <motion.div
                  key="workouts"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6 md:space-y-8"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="text-base md:text-lg font-bold text-[#1e293b] truncate">Workout Plans</h3>
                      <p className="text-[10px] md:text-xs text-muted-foreground truncate">Create plans, assign to any member</p>
                    </div>
                    <Button className="bg-[#22c55e] text-white hover:bg-[#16a34a] rounded-lg font-bold h-8 md:h-9 text-xs shrink-0">
                      <Plus className="w-3.5 h-3.5 md:mr-2" /> <span className="hidden sm:inline">New Plan</span>
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    {initialWorkouts.map((workout) => (
                      <Card key={workout.id} className="p-4 md:p-6 bg-white border-border rounded-2xl md:rounded-[28px] shadow-sm flex flex-col gap-3 md:gap-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h4 className="font-bold text-[#1e293b] text-sm md:text-base truncate">{workout.name}</h4>
                            <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5 truncate">{workout.goal}</p>
                          </div>
                          <Badge className="bg-[#f0fdf4] text-[#166534] border-[#dcfce7] shadow-none text-[8px] md:text-[10px] font-bold shrink-0">
                            {workout.sessions}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" className="flex-1 h-8 md:h-10 rounded-lg md:rounded-xl font-bold border-border text-[#64748b] text-[10px] md:text-xs">
                            Edit
                          </Button>
                          <Button variant="outline" className="w-8 h-8 md:w-10 md:h-10 p-0 rounded-lg md:rounded-xl border-border text-destructive hover:bg-destructive/10">
                            <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="min-w-0">
                      <h3 className="text-base md:text-lg font-bold text-[#1e293b] truncate">Diet Plans</h3>
                      <p className="text-[10px] md:text-xs text-muted-foreground truncate">Create nutrition plans</p>
                    </div>
                    <Button className="bg-[#22c55e] text-white hover:bg-[#16a34a] rounded-lg font-bold h-8 md:h-9 text-xs shrink-0">
                      <Plus className="w-3.5 h-3.5 md:mr-2" /> <span className="hidden sm:inline">New Diet Plan</span>
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    {initialDiets.map((diet) => (
                      <Card key={diet.id} className="p-4 md:p-6 bg-white border-border rounded-2xl md:rounded-[28px] shadow-sm flex flex-col gap-3 md:gap-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h4 className="font-bold text-[#1e293b] text-sm md:text-base truncate">{diet.name}</h4>
                            <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5 truncate">{diet.type}</p>
                          </div>
                          <Badge className="bg-[#eff6ff] text-[#1e40af] border-[#dbeafe] shadow-none text-[8px] md:text-[10px] font-bold uppercase shrink-0">
                            {diet.calories}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" className="flex-1 h-8 md:h-10 rounded-lg md:rounded-xl font-bold border-border text-[#64748b] text-[10px] md:text-xs">
                            Edit
                          </Button>
                          <Button variant="outline" className="w-8 h-8 md:w-10 md:h-10 p-0 rounded-lg md:rounded-xl border-border text-destructive hover:bg-destructive/10">
                            <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "earnings" && (
                <motion.div
                  key="earnings"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4 md:space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 md:gap-3">
                      <span className="text-[10px] md:text-xs font-bold text-[#64748b]">FY:</span>
                      <Badge variant="outline" className="bg-white border-border px-2 md:px-3 py-1 font-bold text-xs md:text-sm rounded-lg flex items-center gap-2 text-nowrap">
                        FY 2026-27 <ChevronRight className="w-3 h-3 rotate-90" />
                      </Badge>
                    </div>
                    <Button variant="outline" className="border-border text-[#64748b] font-bold h-9 md:h-10 flex items-center gap-2 px-3 md:px-4 rounded-lg min-w-max text-xs md:text-sm">
                      <Download className="w-3.5 md:w-4 h-3.5 md:h-4" /> <span className="sm:inline">Export GSTR-1</span>
                    </Button>
                  </div>

                  <div className="bg-[#fffbeb] border border-[#fef3c7] p-3 md:p-4 rounded-xl md:rounded-2xl flex items-center gap-3 md:gap-4 text-[#854d0e]">
                    <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
                    <p className="text-[11px] md:text-sm font-semibold">
                      GSTIN not set. <span className="underline cursor-pointer font-bold">Configure GST</span> for bills.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 md:gap-3">
                    {[
                      { label: "MONTH", val: "₹18,500", bg: "bg-[#f0f9ff] text-[#0369a1]" },
                      { label: "FY 26-27", val: "₹45,200", bg: "bg-[#f0fdf4] text-[#166534]" },
                      { label: "ALL TIME", val: "₹1.2L", bg: "bg-[#f8fafc] text-[#1e293b]" },
                      { label: "TAXABLE", val: "₹38,300", bg: "bg-[#faf5ff] text-[#6b21a8]" },
                      { label: "GST", val: "₹6,900", bg: "bg-[#f0fdf4] text-[#166534]" },
                    ].map((stat) => (
                      <div key={stat.label} className={`${stat.bg} p-2.5 md:p-3.5 rounded-xl border border-black/5 flex flex-col justify-center`}>
                        <div className="flex items-center gap-1 mb-0.5">
                          <IndianRupee className="w-2.5 md:w-3 h-2.5 md:h-3 opacity-60" />
                          <span className="text-[7px] md:text-[9px] font-bold tracking-wider uppercase opacity-80 truncate">{stat.label}</span>
                        </div>
                        <p className="text-sm md:text-lg font-black truncate">{stat.val}</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 md:space-y-4 pt-2 md:pt-4">
                    <h4 className="text-xs md:text-sm font-bold text-[#1e293b]">Recent Payments</h4>
                    <div className="space-y-2">
                      {[
                        { member: "Rahul Sharma", date: "27 Apr 26", amount: "₹3,000", status: "Paid" },
                        { member: "Amit Patel", date: "25 Apr 26", amount: "₹1,200", status: "Paid" },
                        { member: "Priya Singh", date: "20 Apr 26", amount: "₹6,000", status: "Paid" },
                      ].map((payment, i) => (
                        <div key={i} className="bg-white p-3 md:p-4 rounded-xl border border-border flex items-center justify-between shadow-sm">
                          <div className="flex items-center gap-2 md:gap-3">
                            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#f1f5f9] flex items-center justify-center text-[#64748b] text-[9px] md:text-[10px] font-black uppercase">{payment.member[0]}</div>
                            <div>
                              <p className="text-xs md:text-sm font-bold truncate max-w-[80px] md:max-w-none">{payment.member}</p>
                              <p className="text-[9px] md:text-[10px] text-muted-foreground">{payment.date}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs md:text-sm font-black text-[#1e293b]">{payment.amount}</p>
                            <Badge className="bg-emerald-50 text-emerald-600 border-none text-[8px] md:text-[9px] px-1 h-3.5 md:h-4">PAID</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "gst" && (
                <motion.div
                  key="gst"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4 md:space-y-6"
                >
                  <h3 className="text-base md:text-lg font-bold text-[#1e293b]">GST & Billing</h3>
                  <div className="bg-white p-5 md:p-8 rounded-2xl border border-border space-y-4 max-w-lg shadow-sm">
                    <div className="space-y-1.5">
                      <label className="text-[8px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Gym Name</label>
                      <Input defaultValue="Dynamo Fitness Gym" className="h-10 md:h-12 bg-[#f8fafc] border-border text-xs md:text-sm" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[8px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest">GSTIN (Optional)</label>
                      <Input placeholder="e.g. 07AAAAA0000A1Z5" className="h-10 md:h-12 bg-[#f8fafc] border-border text-xs md:text-sm" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[8px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest">SAC Code</label>
                        <Input defaultValue="999723" className="h-10 md:h-12 bg-[#f8fafc] border-border text-xs md:text-sm" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[8px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Rate (%)</label>
                        <Input defaultValue="18" className="h-10 md:h-12 bg-[#f8fafc] border-border text-xs md:text-sm" />
                      </div>
                    </div>
                    <Button className="w-full bg-[#22c55e] text-white hover:bg-[#16a34a] h-10 md:h-12 rounded-xl font-bold text-sm md:text-base mt-2 shadow-lg shadow-[#22c55e]/20">
                      Save Settings
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="bg-white p-3 md:p-4 border-t border-border flex items-center justify-center gap-4 md:gap-6 overflow-x-auto text-nowrap scrollbar-hide">
            {[
              { label: "Auto-Reminders" },
              { label: "Daily Backups" },
              { label: "SSL Secure" }
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5 shrink-0">
                <Check className="w-3.5 md:w-4 h-3.5 md:h-4 text-[#22c55e]" />
                <span className="text-[9px] md:text-[11px] font-bold text-[#64748b]">{item.label}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Back Side: Website Editor Preview */}
        <Card 
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          className="absolute inset-0 bg-white border-border shadow-2xl overflow-hidden border-2 flex flex-col"
        >
          {/* Preview Header */}
          <div className="bg-white px-3 md:px-4 py-3 border-b border-border flex items-center justify-between">
             <div className="flex items-center gap-2">
                <Button 
                  onClick={() => setIsWebsiteView(false)}
                  variant="ghost" 
                  size="sm" 
                  className="h-8 px-2 text-muted-foreground hover:text-foreground"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Back
                </Button>
                <div className="w-px h-4 bg-border mx-1" />
                <span className="text-[11px] font-bold text-foreground truncate max-w-[100px] sm:max-w-none">Website Preview</span>
             </div>
             <div className="flex items-center gap-2 bg-muted/30 p-1 rounded-lg">
                <div className="w-7 h-7 rounded-md bg-white shadow-sm flex items-center justify-center text-primary">
                   <Monitor className="w-3.5 h-3.5" />
                </div>
                <div className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:bg-white hover:shadow-sm transition-all cursor-pointer">
                   <Smartphone className="w-3.5 h-3.5" />
                </div>
             </div>
          </div>

          {/* Website Iframe */}
          <div className="flex-1 bg-[#f1f5f9] p-2 md:p-6 flex items-center justify-center overflow-hidden">
             <div className="w-full h-full bg-white rounded-xl shadow-2xl border border-border overflow-hidden relative">
                {isWebsiteView && (
                   <iframe
                      src="/preview/gym"
                      className="w-full h-full border-none"
                      title="Website Preview"
                   />
                )}
                {!isWebsiteView && (
                   <div className="absolute inset-0 flex items-center justify-center bg-white">
                      <div className="flex flex-col items-center gap-3">
                         <div className="w-8 h-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                         <p className="text-[10px] font-medium text-muted-foreground">Loading preview...</p>
                      </div>
                   </div>
                )}
             </div>
          </div>

          <div className="p-3 border-t border-border bg-white flex items-center justify-center gap-3">
             <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                This is your live website.
             </p>
             <a
               href="/preview/test?preset=gym"
               target="_blank"
               rel="noopener noreferrer"
               className="text-[9px] font-bold text-primary underline uppercase tracking-widest cursor-pointer"
             >
               Edit instantly →
             </a>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

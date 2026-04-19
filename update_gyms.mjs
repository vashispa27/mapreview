import fs from 'fs';
import { parse } from 'json2csv';

const gymsJsonPath = './gyms.json';
const gymsCsvPath = './gyms.csv';

const template = `Hi [Gym Name]! 🏋️‍♂️

I noticed your gym on Google Maps and built a professional website for you. You can sell your gym products, memberships, and services directly on it!

Everything is automatically synced with your Google Maps profile.

Check it out here: https://maptosite.app

⚡ SPEED CHALLENGE: If you can finish your site setup in less than 60 seconds, you get 50% OFF! Are you ready?`;

function formatPhone(phone) {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return '91' + digits;
  }
  return digits;
}

function updateGyms() {
  const data = JSON.parse(fs.readFileSync(gymsJsonPath, 'utf8'));

  const updatedData = data.map(gym => {
    const formattedPhone = formatPhone(gym.phone);
    if (!formattedPhone) {
      gym.whatsapp_link = '';
      return gym;
    }

    const message = template.replace('[Gym Name]', gym.name);
    const encodedMessage = encodeURIComponent(message);
    gym.whatsapp_link = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
    return gym;
  });

  fs.writeFileSync(gymsJsonPath, JSON.stringify(updatedData, null, 2));
  console.log('Updated gyms.json');

  const fields = ['name', 'google_maps', 'rating', 'review_count', 'website', 'instagram', 'phone', 'address', 'category', 'whatsapp_link'];
  const csv = parse(updatedData, { fields });
  fs.writeFileSync(gymsCsvPath, csv);
  console.log('Regenerated gyms.csv');
}

updateGyms();

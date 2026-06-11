import type { Customer } from "@/types/user";

const NAMES = [
  "Adaeze Okafor", "Tomi Adeleke", "Chioma Ezeh", "Olumide Adebayo", "Ngozi Kalu",
  "Funke Bello", "Ifeoluwa Adesina", "Kemi Lawal", "Sandra Ojo", "Daniel Eze",
  "Ahmed Bello", "Amaka Nnamdi", "Hauwa Mohammed", "Tunde Akin", "Zainab Yusuf",
  "Chinedu Obi", "Bisola Ade", "Emeka Okonkwo", "Stella Nwosu", "Adesuwa Eghosa",
  "Yetunde Aluko", "Modupe Bankole", "Ibrahim Sule", "Aisha Mustapha", "Tobi Soyinka",
  "Rachel Okonjo", "Femi Adekunle", "Chimamanda Nwafor", "Halima Garba", "Tochi Iheanacho",
];

const STATES = ["Lagos", "Lagos", "Lagos", "Lagos", "Abuja", "Abuja", "Rivers", "Oyo", "Kaduna", "Edo"];
const CITIES_LAGOS = ["Ikoyi", "Victoria Island", "Lekki", "Yaba", "Ikeja", "Surulere"];
const CITIES_ABUJA = ["Wuse", "Garki", "Asokoro", "Maitama"];
const CITIES_OTHER = ["Port Harcourt", "Ibadan", "Kaduna", "Benin City"];

export const MOCK_CUSTOMERS: Customer[] = NAMES.map((name, i) => {
  const state = STATES[i % STATES.length];
  const city =
    state === "Lagos"
      ? CITIES_LAGOS[i % CITIES_LAGOS.length]
      : state === "Abuja"
        ? CITIES_ABUJA[i % CITIES_ABUJA.length]
        : CITIES_OTHER[i % CITIES_OTHER.length];

  const lifetimeOrders = 1 + (i % 9);
  const avgSpend = 18000;
  const lifetimeSpend = lifetimeOrders * (avgSpend + (i % 5) * 4000);

  return {
    id: `c_${String(i + 1).padStart(3, "0")}`,
    fullName: name,
    email: `${name.split(" ")[0].toLowerCase()}.${name.split(" ")[1]?.toLowerCase() ?? "x"}@example.com`,
    phone: `+234 80${(3 + (i % 6))} 555 ${String(1000 + i).slice(-4)}`,
    joinedAt: new Date(2024, 6 + (i % 12), 1 + (i % 27)).toISOString().slice(0, 10),
    lifetimeOrders,
    lifetimeSpend,
    rewardsBalance: Math.max(0, (lifetimeOrders * 95) - (i * 4)),
    city,
    state,
  };
});

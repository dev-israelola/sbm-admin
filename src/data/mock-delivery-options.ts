import type { DeliveryOptions, DeliveryState, PickupStation } from "@/types/delivery";

const states: DeliveryState[] = [
  { code: "LA", name: "Lagos", homeDeliveryFee: 2500, cities: ["Ikoyi", "Victoria Island", "Lekki", "Yaba", "Surulere", "Ikeja", "Ajah", "Mainland", "Apapa", "Magodo"] },
  { code: "FC", name: "Abuja (FCT)", homeDeliveryFee: 3500, cities: ["Wuse", "Maitama", "Garki", "Asokoro", "Gwarinpa", "Kubwa"] },
  { code: "RI", name: "Rivers", homeDeliveryFee: 4500, cities: ["Port Harcourt", "Eleme", "Obio-Akpor"] },
  { code: "OY", name: "Oyo", homeDeliveryFee: 4200, cities: ["Ibadan", "Ogbomosho", "Iseyin"] },
  { code: "KN", name: "Kano", homeDeliveryFee: 6000, cities: ["Kano", "Nasarawa", "Fagge"] },
  { code: "KD", name: "Kaduna", homeDeliveryFee: 5500, cities: ["Kaduna", "Zaria", "Kafanchan"] },
  { code: "ED", name: "Edo", homeDeliveryFee: 4800, cities: ["Benin City", "Auchi", "Ekpoma"] },
  { code: "EN", name: "Enugu", homeDeliveryFee: 5000, cities: ["Enugu", "Nsukka"] },
  { code: "AN", name: "Anambra", homeDeliveryFee: 5000, cities: ["Awka", "Onitsha", "Nnewi"] },
  { code: "DE", name: "Delta", homeDeliveryFee: 4800, cities: ["Asaba", "Warri", "Sapele"] },
  { code: "OG", name: "Ogun", homeDeliveryFee: 3000, cities: ["Abeokuta", "Sagamu", "Ijebu Ode"] },
  { code: "OS", name: "Osun", homeDeliveryFee: 4200, cities: ["Osogbo", "Ile-Ife", "Ilesha"] },
];

export const MOCK_PICKUP_STATIONS: PickupStation[] = [
  { id: "ps_lag_ikoyi", name: "naturale Ikoyi Apothecary", state: "Lagos", city: "Ikoyi", address: "12 Glover Road, Ikoyi", fee: 1500, hours: "Mon–Sat · 9am–7pm", phone: "+234 803 555 0001", active: true },
  { id: "ps_lag_lekki", name: "naturale Lekki Wellness Hub", state: "Lagos", city: "Lekki", address: "Plot 17 Admiralty Way, Lekki Phase 1", fee: 1500, hours: "Mon–Sun · 10am–8pm", phone: "+234 803 555 0002", active: true },
  { id: "ps_abu_wuse2", name: "naturale Wuse II", state: "Abuja (FCT)", city: "Wuse", address: "Suite 5, Aminu Kano Crescent, Wuse 2", fee: 1800, hours: "Mon–Sat · 9am–6pm", phone: "+234 803 555 0003", active: true },
  { id: "ps_abu_maitama", name: "naturale Maitama", state: "Abuja (FCT)", city: "Maitama", address: "23 Gana Street, Maitama", fee: 1800, hours: "Mon–Sat · 9am–7pm", phone: "+234 803 555 0004", active: true },
  { id: "ps_phc_gra", name: "naturale Port Harcourt GRA", state: "Rivers", city: "Port Harcourt", address: "8 Aba Road, GRA Phase 2", fee: 2000, hours: "Mon–Sat · 10am–6pm", phone: "+234 803 555 0005", active: true },
  { id: "ps_phc_woji", name: "naturale Woji Park", state: "Rivers", city: "Port Harcourt", address: "Block C, Woji Plaza", fee: 2000, hours: "Mon–Fri · 10am–6pm", phone: "+234 803 555 0006", active: true },
  { id: "ps_iba_bodija", name: "naturale Bodija", state: "Oyo", city: "Ibadan", address: "15 Bodija Estate Crescent", fee: 1800, hours: "Mon–Sat · 9am–6pm", phone: "+234 803 555 0007", active: true },
  { id: "ps_iba_ringroad", name: "naturale Ring Road", state: "Oyo", city: "Ibadan", address: "Suite 4, Ring Road Mall", fee: 1800, hours: "Mon–Sat · 10am–7pm", phone: "+234 803 555 0008", active: true },
  { id: "ps_kano_sabon", name: "naturale Sabon Gari", state: "Kano", city: "Kano", address: "12 Sabon Gari Market Road", fee: 2000, hours: "Mon–Sat · 9am–5pm", phone: "+234 803 555 0009", active: true },
  { id: "ps_kano_brt", name: "naturale BRT Centre", state: "Kano", city: "Kano", address: "Hotoro BRT Plaza, Unit 11", fee: 2000, hours: "Mon–Sat · 10am–6pm", phone: "+234 803 555 0010", active: true },
  { id: "ps_kdn_barnawa", name: "naturale Barnawa", state: "Kaduna", city: "Kaduna", address: "8 Barnawa Shopping Complex", fee: 2000, hours: "Mon–Sat · 9am–6pm", phone: "+234 803 555 0011", active: true },
  { id: "ps_kdn_kawo", name: "naturale Kawo", state: "Kaduna", city: "Kaduna", address: "Block A, Kawo New Extension", fee: 2000, hours: "Mon–Sat · 9am–6pm", phone: "+234 803 555 0012", active: true },
  { id: "ps_bni_gra", name: "naturale Benin GRA", state: "Edo", city: "Benin City", address: "5 Sapele Road, GRA", fee: 1800, hours: "Mon–Sat · 10am–6pm", phone: "+234 803 555 0013", active: true },
  { id: "ps_bni_ringroad", name: "naturale Benin Ring Road", state: "Edo", city: "Benin City", address: "12 Akpakpava Street", fee: 1800, hours: "Mon–Fri · 10am–6pm", phone: "+234 803 555 0014", active: true },
  { id: "ps_enu_independence", name: "naturale Independence Layout", state: "Enugu", city: "Enugu", address: "10 Independence Layout Avenue", fee: 1800, hours: "Mon–Sat · 9am–6pm", phone: "+234 803 555 0015", active: true },
  { id: "ps_enu_garden", name: "naturale Garden Avenue", state: "Enugu", city: "Enugu", address: "Suite 9, Garden Avenue Mall", fee: 1800, hours: "Mon–Sat · 10am–6pm", phone: "+234 803 555 0016", active: false },
];

export const MOCK_DELIVERY_OPTIONS: DeliveryOptions = {
  states,
  pickupStations: MOCK_PICKUP_STATIONS.filter((s) => s.active),
  freeHomeDeliveryThreshold: 50000,
};

import { RestaurantProps } from "@/types/restaurant";

export const restaurants: RestaurantProps[] = [
  {
    id: 1,
    title: "Restaurante 1",
    active: true,
    phone1: "(00)00000-0000",
    phone2: "(00)00000-0000",
    address: "Rua exemplo da silva, 123. Centro. São Paulo-SP",
    methods: ["Dinheiro", "PIX", "Crédito", "Débito"],
    workHours: [
      {
        weekDay: 1,
        opened: false,
        times: {},
      },
      {
        weekDay: 2,
        opened: true,
        times: {
          open: "08:00",
          close: "13:00",
        },
      },
    ],
    logo: "https://i.imgur.com/7jkiMQN.png",
    color: "#f02",
    linkMaps: "/",
    note: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer luctus ante sed ligula efficitur, ac consequat odio vestibulum. In hac habitasse platea dictumst",
    activeMenu: true,
  },
  {
    id: 2,
    title: "Restaurante 2",
    active: false,
    phone1: "(00)00000-0000",
    phone2: "(00)00000-0000",
    address: "Rua exemplo da silva, 123. Centro. São Paulo-SP",
    methods: ["Dinheiro", "PIX", "Crédito", "Débito"],
    workHours: [
      {
        weekDay: 1,
        opened: false,
        times: {},
      },
      {
        weekDay: 2,
        opened: true,
        times: {
          open: "08:00",
          close: "13:00",
        },
      },
    ],
    logo: "https://i.imgur.com/7jkiMQN.png",
    color: "#f02",
    linkMaps: "/",
    note: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer luctus ante sed ligula efficitur, ac consequat odio vestibulum. In hac habitasse platea dictumst",
    activeMenu: true,
  },
];

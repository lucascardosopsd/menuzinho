import { axiosAsaas } from "@/lib/axiosAsaas";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json();

    const customer = await axiosAsaas.put(
      `https://sandbox.asaas.com/api/v3/customers/${params.id}`,
      data
    );

    return Response.json({ customer: customer.data });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log("An unknown error occurred");
    }

    return Response.json({});
  }
}
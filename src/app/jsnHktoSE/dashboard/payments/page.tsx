import { fetchManyPayments } from "@/actions/payments/fetchManyPayments";
import { fetchRegions } from "@/actions/region/fetchRegions";
import PaymentRow from "@/components/admin/tableRows/PaymentRow";
import DateRange from "@/components/advertiser/inputs/DateRange";
import Paginate from "@/components/misc/Paginate";
import ReusableComboSearch from "@/components/misc/ReusableComboSearch";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdvertiserAccount, Payment } from "@prisma/client";

interface PaymentProps extends Payment {
  AdvertiserAccount: AdvertiserAccount;
}

interface PaymentReturnProps {
  payments: PaymentProps[];
  pages: number;
}

interface AdminDashboardProps {
  searchParams?: {
    startDate?: Date;
    endDate?: Date;
    regionId?: string;
    page: string;
  };
}

const AdminDashboard = async ({ searchParams }: AdminDashboardProps) => {
  const startDate = searchParams?.startDate;
  const endDate = searchParams?.endDate;
  const regionId = searchParams?.regionId;
  const page = searchParams?.page;

  const { payments, pages } = await fetchManyPayments<PaymentReturnProps>({
    page: 0,
    take: 10000,
    query: {
      where: endDate &&
        startDate && {
          createdAt: {
            lte: new Date(endDate),
            gte: new Date(startDate),
          },
          regionId: regionId || {},
        },
      include: {
        AdvertiserAccount: true,
      },
    },
  });

  const regions = await fetchRegions();

  const regionsOptions = regions.map((region) => ({
    label: region.title,
    value: region.id,
  }));

  return (
    <section className="flex flex-col items-center justify-center overflow-y-auto h-screen w-full gap-5 my-5">
      <div className="flex items-center gap-10">
        <div className="flex flex-col">
          <p className="text-xs">Filtrar região</p>
          <ReusableComboSearch
            items={regionsOptions}
            title="Filtrar região"
            queryTitle="regionId"
          />
        </div>
        <DateRange
          startDate={startDate || undefined}
          endDate={endDate || undefined}
          className="justify-center"
        />
      </div>

      <Separator />

      <div className="flex flex-col gap-5 h-[calc(100svh-120px)] overflow-y-auto pb-20 w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Anunciante</TableHead>

              <TableHead>Plano</TableHead>

              <TableHead>Valor</TableHead>

              <TableHead>Data</TableHead>

              <TableHead>Deletar</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {payments.map((payment) => (
              <PaymentRow payment={payment} key={payment.id} />
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="absolute bottom-0 left-0 w-full flex items-center bg-background">
        <Paginate pages={pages} current={Number(page)} />
      </div>
    </section>
  );
};

export default AdminDashboard;

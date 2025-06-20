import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import Form from "@/app/ui/invoices/edit-form";
import { fetchCustomers, fetchInvoiceById } from "@/app/lib/data";
import { notFound } from "next/navigation";
import { Metadata } from "next";


export const metadata: Metadata = {
    title: 'InvoicesEdit',
};


type Props = {
    params: Promise<{
        id: string;
    }>
}

export default async function Page(props: Props) {

    const params = await props.params;
    const id = params.id;
    const [invoice, customers] = await Promise.all([
        fetchInvoiceById(id),
        fetchCustomers(),
    ]);

    if (!invoice) {
        notFound();
    }
    // この関数を呼ぶとnot-found.tsxファイルが表示される
    // notFound は error.tsx よりも優先される

    return (
        <main>
            <Breadcrumbs breadcrumbs={[
                {
                    label: 'Invoices',
                    href: '/dashboard/invoices',
                },
                {
                    label: 'Edit Invoice',
                    href: '/dashboard/invoices/${id}/edit',
                    active: true,
                },
            ]} />

            <Form invoice={invoice} customers={customers} />
        </main>
    );
}
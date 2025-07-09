import { Form } from "@/components/ui/form"
import { ClientService } from "@/service/client/client.service"
import { ClientSave, ClientType, schemaClient } from "@/types/client.type"
import { FormEditAddType } from "@/types/form-edit-add/form-edit-add.type"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"

const ClientForm = ({ edit, data: client, onSucces }: FormEditAddType<ClientType>) => {
    const formSave = useForm<ClientSave>({
        mode: 'onChange',
        reValidateMode: 'onChange',
        resolver: zodResolver(schemaClient)
    })

    const AddMutatio = useMutation({
        mutationFn: async (data: ClientSave) => { return await ClientService.saveClient(data) }
    })


    return <Form {...formSave}>
        <form noValidate onSubmit={formSave.handleSubmit((data) => AddMutatio.mutate(data))} className={"flex flex-col gap-2"}>


        </form>
    </Form>
}


export default ClientForm
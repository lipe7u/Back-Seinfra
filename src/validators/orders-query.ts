import { z } from "zod";

const ordersqueryschema = z.object({
  mensagem: z.string().min(1),
  id_ordem: z.number().min(1).optional(),
})

export { ordersqueryschema };
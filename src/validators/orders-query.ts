import { z } from "zod";

const ordersqueryschema = z.object({
  mensagem: z.string().min(1, "A mensagem é obrigatória"),
  id_ordem: z.coerce.number().int().positive().optional(),
})

export { ordersqueryschema };
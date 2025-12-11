"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ordersqueryschema = void 0;
const zod_1 = require("zod");
const ordersqueryschema = zod_1.z.object({
    mensagem: zod_1.z.string().min(1, "A mensagem é obrigatória"),
    id_ordem: zod_1.z.coerce.number().int().positive().optional(),
});
exports.ordersqueryschema = ordersqueryschema;

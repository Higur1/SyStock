import { z } from "zod";
import Batch from "../models/Batch";

export default class BatchController {
  static async findAll(request, response) {
    try {

      const batchs = await Batch.findAll();

      if (batchs.status) {
        response.status(200).send(
          JSON.stringify({
            batchs: batchs.batchs,
          })
        );
      } else {
        response.status(500).send(
          JSON.stringify({
            error: batchs.error.message,
          })
        );
      }
    } catch (error) {
      response.status(500).send(
        JSON.stringify({
          error: error,
        })
      );
    }
  }
  /*Resolver*/ static async findBatch(request, response) {
    try {
    } catch (error) {
      response.status(400).send(
        JSON.stringify({
          path: error.issues[0].path,
          error: error.issues[0].message,
        })
      );
    }
  }
  static async findBatchBySupplier(request, response) {
    try {
      const supplierValidation = z.object({
        supplier_id: z.string().trim().min(36).max(36),
      });

      const { supplier_id } = supplierValidation.parse(request.params);

      const batch_supplier = await Batch.findBySupplier(
        supplier_id
      );

      if (batch_supplier.status) {
        response.status(200).send(
          JSON.stringify({
            batchs: batch_supplier.batch,
          })
        );
      } else {
        response.status(500).send(
          JSON.stringify({
            error: batch_supplier.error.message,
          })
        );
      }
    } catch (error) {
      response.status(400).send(
        JSON.stringify({
          path: error.issues[0].path,
          error: error.issues[0].message,
        })
      );
    }
  }
  static async findBatchByProduct(request, response) {
    try {
      const productValidation = z.object({
        product_id: z.string().trim().min(1),
      });

      const { product_id } = productValidation.parse(request.params);

      const batch_product = await Batch.findByProduct(Number(product_id));

      if(batch_product.status){
        response.status(200).send(
            JSON.stringify({
                batch: batch_product.batch
            })
        );
      }else{
        response.status(500).send(
            JSON.stringify({
                error: batch_product.error.message
            })
        );
      };
    } catch (error) {
      response.status(400).send(
        JSON.stringify({
          path: error.issues[0].path,
          error: error.issues[0].message,
        })
      );
    };
  };
  static async update(request, response) {
    try {
        const batchValidation = z.object({
            product_id:  z.string().trim().min(1),
            supplier_id: z.string().trim().min(36).max(36),
            quantity: z.number().positive()
        });

        const { product_id, supplier_id , quantity } = batchValidation.parse(request.body);

        const batch = {
            product_id,
            supplier_id,
            quantity
        };

        const batchUpdated = await Batch.update(batch);

        if(batchUpdated.status){
            response.status(200).send(
                JSON.stringify({
                    batch: batchUpdated.batch
                })
            );
        }else{
            response.status(500).send(
                JSON.stringify({
                    error: batchUpdated.error.message
                })
            );
        };
    } catch (error) {
      response.status(400).send(
        JSON.stringify({
          path: error.issues[0].path,
          error: error.issues[0].message,
        })
      );
    };
  };
  static async delete(request, response) {
    try {
    } catch (error) {
      response.status(400).send(
        JSON.stringify({
          path: error.issues[0].path,
          error: error.issues[0].message,
        })
      );
    };
  };
};

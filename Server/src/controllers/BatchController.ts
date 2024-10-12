import { z } from "zod";
import batchService from "../service/BatchService";
import Batch from "../models/Batch";

export default class BatchController {
  static async findAll(request, response) {
    try {
      const batchsResult = await batchService.findAll();

      if (batchsResult.status) {
        response.status(200).send(
          JSON.stringify({
            batchs: batchsResult.batchs,
          })
        );
      } else {
        response.status(500).send(
          JSON.stringify({
            error: batchsResult.error.message,
          })
        );
      }
    } catch (error) {
      response.status(400).send(
        JSON.stringify({
          error: error,
        })
      );
    }
  }
  static async findBatch(request, response) {
    try {
      const batchValidation = z.object({
        id: z.number().positive()
      })
      const { id } = batchValidation.parse(request.body);

      const batchData: Batch = {
        id: id,
        eValidationStatus: 0,
        expirantionDate: new Date(""),
        product_id: 0,
        quantity: 0,
      }

      const batchResult = await batchService.findBatch(batchData);

      if (batchResult.status) {
        response.status(200).send(
          JSON.stringify({
            batch: batchResult
          })
        )
      } else {
        response.status(500).send(
          JSON.stringify({
            error: batchResult.error.message,
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

      const batchData: Batch = {
        eValidationStatus: 0,
        expirantionDate: new Date(""),
        product_id: Number(product_id),
        quantity: 0,
      }
      const batch_product = await batchService.findByProduct(batchData);

      if (batch_product.status) {
        response.status(200).send(
          JSON.stringify({
            batch: batch_product.batch
          })
        );
      } else {
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
        id: z.number().positive(),
        quantity: z.number().positive()
      });

      const {  id, quantity } = batchValidation.parse(request.body);

      const batchData: Batch = {
       id: id,
        quantity: quantity,
        eValidationStatus: 0,
        expirantionDate: new Date(""),
        product_id: 0
      };
      const batchResult = await batchService.findBatch(batchData);
      if(batchResult.batch == null){
        return response.status(200).send(JSON.stringify({
          message: "Batch not found"
        }))
      }
      const batchUpdated = await batchService.update(batchData);

      if (batchUpdated.status) {
        response.status(200).send(
          JSON.stringify({
            batch: batchUpdated.batch
          })
        );
      } else {
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

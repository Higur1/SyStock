import { z } from "zod";
import batchService from "../service/BatchService";
import Batch from "../models/Batch";
import exp from "constants";

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
    };
  };
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
  static async supply(request, response) {
    try {
      const baseData = ("2024-01-01T03:00:01.000Z");
      const batchValidation = z.object({
        product_id: z.number(),
        expirationDate: z.string().transform((val)=> new Date(val)).default(baseData),
        quantity: z.number(),
        operation: z.number()
      });
      const {product_id, expirationDate, quantity, operation} = batchValidation.parse(request.body);

      const batchData: Batch = {
        product_id : product_id,
        expirantionDate:expirationDate,
        quantity: quantity
      }
      const batchIsValid = await batchService.searchForExpirationDate(batchData);

      if(batchIsValid.find){
        const batchSupply = await batchService.update(batchData, operation);
        if(batchSupply.status){
          response.status(200).JSON.stringify({
            batch: batchSupply
          })
        }else{
          response.status(500).send(
            JSON.stringify({
              error: batchSupply.error.message
            })
          );
        }
      }else{
        const batchSupply = await batchService.create(batchData);
        if(batchSupply.status){
          response.status(201).JSON.stringify({
            batch: batchSupply
          });
        }else{
          response.status(500).send(
            JSON.stringify({
              error: batchSupply.error.message
            })
          );
        }
      }
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

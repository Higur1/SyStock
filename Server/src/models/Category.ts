import { prisma } from "../config/prisma";

export default class Category{
    static async findAll(company_id){
        try {
            const listOfCategory = await prisma.category.findMany({
                where:{
                    company_id: company_id
                }
            });    
            return listOfCategory != undefined ? {status: true, listOfCategory: listOfCategory} : {status: true, listOfCategory: {}};
        } catch (error) {
            return {status: false, error: error};
        }
    }
    static async create(company_id, name){
        try {
            const category = await prisma.category.create({
                data:{
                    name: name,
                    company_id: company_id
                }
            });
            return category != undefined ? {status: true, category:{category_id: category.id, category_name: category.name, category_company_id: category.company_id}} : {status: true, category: {}};
        } catch (error) {
            return {status: false, error:error};
        }
    }
    static async findById(company_id, id){
        try {
            const category = await prisma.category.findFirst({
                where:{
                    id: id,
                    company_id: company_id
                }
            });
            return category != undefined ? {status: true, category: category} : {status: true, category: {}};
        } catch (error) {
            return {status: false, error:error};
        }
    }
    static async findByName(company_id, category_name){
        try {
            const categories = await prisma.category.findMany({
                where:{
                    company_id:company_id,
                    name:{
                        startsWith: category_name
                    }
                }
            });
            return categories != undefined ? {status: true, categories:categories} : {status: true, categories:{}};
        } catch (error) {
            return {status: false, error:error};
        }
    }
    static async update(category_id, category_name){
        try {
            const categoryUpdated = await prisma.category.update({
                where:{
                    id: category_id
                },
                data:{
                    name: category_name
                }
            });
            return categoryUpdated != undefined ? {status: true, category: categoryUpdated} : {status: true, category: undefined};
        } catch (error) {
            return {status: false, error:error};
        }
    }
    static async delete(category_id){
        try {
            const categoryDeleted = await prisma.category.delete({
                where:{
                    id: category_id
                }
            });
            return categoryDeleted != undefined ? {status: true, category: categoryDeleted} : {status: true, category:{}};
        } catch (error) {
            return {status: false, error:error};
        }
    }
    static async verifyDuplicateName(company_id, category_name){
        try {
            const category = await prisma.category.findFirst({
                where:{
                    company_id: company_id,
                    name: category_name
                }
            });
            return category != undefined ? {status: true, category: category} : {status: true, category: undefined};
        } catch (error) {
            return {status: false, error:error};
        }
    }
}

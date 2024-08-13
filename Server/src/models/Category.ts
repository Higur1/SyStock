import { prisma } from "../config/prisma";

export default class Category{
    static async findAll(){
        try {
            const listOfCategory = await prisma.category.findMany({});    
            return listOfCategory != undefined ? {status: true, listOfCategory: listOfCategory} : {status: true, listOfCategory: {}};
        } catch (error) {
            return {status: false, error: error};
        }
    }
    static async create(name){
        try {
            const category = await prisma.category.create({
                data:{
                    name: name
                }
            });
            return category != undefined ? {status: true, category:{category_id: category.id, category_name: category.name, category_company_id: category.company_id}} : {status: true, category: {}};
        } catch (error) {
            return {status: false, error:error};
        }
    }
    static async findById(id){
        try {
            const category = await prisma.category.findFirst({
                where:{
                    id: id,
                }
            });
            return category != undefined ? {status: true, category: category} : {status: true, category: {}};
        } catch (error) {
            return {status: false, error:error};
        }
    }
    static async findByName(category_name){
        try {
            const categories = await prisma.category.findMany({
                where:{
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
    static async verifyDuplicateName(category_name){
        try {
            const category = await prisma.category.findFirst({
                where:{
                    name: category_name
                }
            });
            return category != undefined ? {status: true, category: category} : {status: true, category: undefined};
        } catch (error) {
            return {status: false, error:error};
        }
    }
}

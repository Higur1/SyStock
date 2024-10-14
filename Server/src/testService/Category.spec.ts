import category from "../service/CategoryService"
import Category from "../models/Category";
import { describe, it, expect, beforeAll, afterAll, beforeEach } from "@jest/globals";

describe("Create category model", () => {
    let categoryId;
    let UniqueName;

    beforeAll(() => {
        const genarateUniqueCategoryName = `Mock Category-${String(Date.now())}`;
        UniqueName = genarateUniqueCategoryName;
    });

    it("Should be able to create a new category", async () => {
        const categoryData: Category = {
            name: UniqueName
        };

        const createCategory = await category.create(categoryData);

        categoryId = createCategory.category!.category_id;
        await expect(createCategory).toHaveProperty("category.category_id");

    });

    it("Should not be able ot create a new category", async () => {
        const categoryData = {
            name: UniqueName
        };

        const createCategory = await category.create(categoryData);
        await expect(createCategory).not.toHaveProperty("message");
    });

    afterAll(async () => {
        await category.delete(categoryId);
    });
});


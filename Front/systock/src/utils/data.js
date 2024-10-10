import Account from "../classes/Account";
import Batch from "../classes/Batch";
import Category from "../classes/Category";
import Product from "../classes/Product";
import Supplier from "../classes/Supplier";
import Supply from "../classes/Supply";


export const suppliers = [
  new Supplier({ name: "Construbras", phone: "11 1234-5678", email: "contato@construbras.com.br" }),
  new Supplier({ name: "Sanitários Brasil", phone: "11 1234-5678", email: "contato@sanitariosbrasil.com" }),
  new Supplier({ name: "Vasos & Cia", phone: "11 2234-5678", email: "contato@vasosecia.com" }),
  new Supplier({ name: "Banheiro Top", phone: "11 3234-5678", email: "contato@banheirotop.com" }),
  new Supplier({ name: "Granitos & Cia", phone: "11 4234-5678", email: "contato@granitoscia.com" }),
  new Supplier({ name: "Pias Brasil", phone: "11 5234-5678", email: "contato@piasbrasil.com" }),
  new Supplier({ name: "Banheiro Perfeito", phone: "11 6234-5678", email: "contato@banheiroperfeito.com" }),
  new Supplier({ name: "Vidrobox", phone: "11 7234-5678", email: "contato@vidrobox.com" }),
  new Supplier({ name: "Boxes & Cia", phone: "11 8234-5678", email: "contato@boxeseacia.com" }),
  new Supplier({ name: "Banho Mais", phone: "11 9234-5678", email: "contato@banhomais.com" }),
  new Supplier({ name: "Cozinha Mais", phone: "11 1244-5678", email: "contato@cozinhamais.com" }),
  new Supplier({ name: "Torneiras & Cia", phone: "11 2244-5678", email: "contato@torneirasecia.com" }),
  new Supplier({ name: "Cozinha Top", phone: "11 3244-5678", email: "contato@cozinhatop.com" }),
  new Supplier({ name: "Pias Inox", phone: "11 4244-5678", email: "contato@piasinox.com" }),
  new Supplier({ name: "Cozinha & Cia", phone: "11 5244-5678", email: "contato@cozinhaecia.com" }),
  new Supplier({ name: "Inox Mais", phone: "11 6244-5678", email: "contato@inoxmais.com" }),
  new Supplier({ name: "Misturadores Brasil", phone: "11 7244-5678", email: "contato@misturadoresbrasil.com" }),
  new Supplier({ name: "Cozinha Pro", phone: "11 8244-5678", email: "contato@cozinhapro.com" }),
  new Supplier({ name: "Torneiras Top", phone: "11 9244-5678", email: "contato@torneirastop.com" }),
  new Supplier({ name: "Farpados & Cia", phone: "11 1254-5678", email: "contato@farpadosecia.com" }),
  new Supplier({ name: "Arames Brasil", phone: "11 2254-5678", email: "contato@aramesbrasil.com" }),
  new Supplier({ name: "Ferro Forte", phone: "11 3254-5678", email: "contato@ferroforte.com" }),
  new Supplier({ name: "Alambrados Brasil", phone: "11 4254-5678", email: "contato@alambradosbrasil.com" }),
  new Supplier({ name: "Telarte", phone: "11 5254-5678", email: "contato@telarte.com" }),
  new Supplier({ name: "Ferragens & Cia", phone: "11 6254-5678", email: "contato@ferragensecia.com" }),
  new Supplier({ name: "Ferramentas Pro", phone: "11 7254-5678", email: "contato@ferramentaspro.com" }),
  new Supplier({ name: "Ferramentas & Cia", phone: "11 8254-5678", email: "contato@ferramentasecia.com" }),
  new Supplier({ name: "Pintura & Cia", phone: "11 9254-5678", email: "contato@pinturaecia.com" }),
  new Supplier({ name: "Ferragens Brasil", phone: "11 1264-5678", email: "contato@ferragensbrasil.com" }),
  new Supplier({ name: "Construparafuso", phone: "11 2264-5678", email: "contato@construparafuso.com" }),
  new Supplier({ name: "Porcas & Cia", phone: "11 3264-5678", email: "contato@porcasecia.com" }),
  new Supplier({ name: "Ferragens Top", phone: "11 4264-5678", email: "contato@ferragenstop.com" }),
  new Supplier({ name: "Construporca", phone: "11 5264-5678", email: "contato@construporca.com" }),
  new Supplier({ name: "Brocas & Cia", phone: "11 6264-5678", email: "contato@brocasecia.com" }),
  new Supplier({ name: "Ferramentas Brasil", phone: "11 7264-5678", email: "contato@ferramentasbrasil.com" }),
  new Supplier({ name: "Construbroca", phone: "11 8264-5678", email: "contato@construbroca.com" }),
  new Supplier({ name: "Ilumina Pro", phone: "11 9264-5678", email: "contato@iluminapro.com" })
];

export const accounts = [
  new Account({ user: "gabriel.akio", password: "123" }),
  new Account({ user: "admin", password: "321" }),
];

export const categories = [
  new Category({name: "Construção"}),
  new Category({name: "Elétrica"}),
  new Category({name: "Hidráulica"}),
  new Category({name: "Pintura"}),
  new Category({name: "Ferragens"}),
  new Category({name: "Ferramentas"}),
  new Category({name: "Acabamento"}),
  new Category({name: "Pisos e Revestimentos"}),
  new Category({name: "Iluminação"}),
  new Category({name: "Madeiras"})
];

export const products = [
  new Product({ name: "Cimento CP-II", refCode: "CMT-001", category: getRandomCategory(), priceBaseSell: 30.00, priceBaseBuy: 30.00, minimumQuantity: 10, description: "" }),
  new Product({ name: "Areia Média", refCode: "ARE-002", category: getRandomCategory(), priceBaseSell: 50.00, priceBaseBuy: 50.00, minimumQuantity: 20, description: "" }),
  new Product({ name: "Brita 1", refCode: "BRI-003", category: getRandomCategory(), priceBaseSell: 60.00, priceBaseBuy: 60.00, minimumQuantity: 15, description: "" }),
  new Product({ name: "Tijolo 8 Furos", refCode: "TIJ-004", category: getRandomCategory(), priceBaseSell: 1.20, priceBaseBuy: 1.20, minimumQuantity: 500, description: "" }),
  new Product({ name: "Telha Cerâmica", refCode: "TEL-005", category: getRandomCategory(), priceBaseSell: 3.50, priceBaseBuy: 3.50, minimumQuantity: 200, description: "" }),
  new Product({ name: "Bloco de Concreto", refCode: "BLO-006", category: getRandomCategory(), priceBaseSell: 4.00, priceBaseBuy: 4.00, minimumQuantity: 300, description: "" }),
  new Product({ name: "Cal Hidratada", refCode: "CAL-007", category: getRandomCategory(), priceBaseSell: 25.00, priceBaseBuy: 25.00, minimumQuantity: 50, description: "" }),
  new Product({ name: "Aditivo Plastificante", refCode: "ADT-008", category: getRandomCategory(), priceBaseSell: 80.00, priceBaseBuy: 80.00, minimumQuantity: 10, description: "" }),
  new Product({ name: "Manta Asfáltica", refCode: "MAN-009", category: getRandomCategory(), priceBaseSell: 120.00, priceBaseBuy: 120.00, minimumQuantity: 25, description: "" }),
  new Product({ name: "Piso Cerâmico", refCode: "PIS-010", category: getRandomCategory(), priceBaseSell: 15.00, priceBaseBuy: 15.00, minimumQuantity: 100, description: "" }),
  new Product({ name: "Argamassa AC-II", refCode: "ARG-011", category: getRandomCategory(), priceBaseSell: 22.00, priceBaseBuy: 22.00, minimumQuantity: 40, description: "" }),
  new Product({ name: "Rejunte Flexível", refCode: "REJ-012", category: getRandomCategory(), priceBaseSell: 18.00, priceBaseBuy: 18.00, minimumQuantity: 30, description: "" }),
  new Product({ name: "Tubo de PVC 100mm", refCode: "PVC-013", category: getRandomCategory(), priceBaseSell: 45.00, priceBaseBuy: 45.00, minimumQuantity: 20, description: "" }),
  new Product({ name: "Conector de Eletroduto", refCode: "ELE-014", category: getRandomCategory(), priceBaseSell: 2.50, priceBaseBuy: 2.50, minimumQuantity: 100, description: "" }),
  new Product({ name: "Fio Elétrico 2,5mm", refCode: "FIO-015", category: getRandomCategory(), priceBaseSell: 120.00, priceBaseBuy: 120.00, minimumQuantity: 15, description: "" }),
  new Product({ name: "Interruptor Simples", refCode: "INT-016", category: getRandomCategory(), priceBaseSell: 8.00, priceBaseBuy: 8.00, minimumQuantity: 100, description: "" }),
  new Product({ name: "Tomada 20A", refCode: "TOM-017", category: getRandomCategory(), priceBaseSell: 12.00, priceBaseBuy: 12.00, minimumQuantity: 100, description: "" }),
  new Product({ name: "Disjuntor Bipolar", refCode: "DIS-018", category: getRandomCategory(), priceBaseSell: 35.00, priceBaseBuy: 35.00, minimumQuantity: 30, description: "" }),
  new Product({ name: "Lâmpada LED 12W", refCode: "LED-019", category: getRandomCategory(), priceBaseSell: 10.00, priceBaseBuy: 10.00, minimumQuantity: 200, description: "" }),
  new Product({ name: "Tintura Branca 18L", refCode: "TIN-020", category: getRandomCategory(), priceBaseSell: 150.00, priceBaseBuy: 150.00, minimumQuantity: 20, description: "" }),
  new Product({ name: "Lixa de Parede", refCode: "LIX-021", category: getRandomCategory(), priceBaseSell: 5.00, priceBaseBuy: 5.00, minimumQuantity: 100, description: "" }),
  new Product({ name: "Massa Corrida 25Kg", refCode: "MAS-022", category: getRandomCategory(), priceBaseSell: 60.00, priceBaseBuy: 60.00, minimumQuantity: 50, description: "" }),
  new Product({ name: "Verniz Marítimo 3,6L", refCode: "VER-023", category: getRandomCategory(), priceBaseSell: 70.00, priceBaseBuy: 70.00, minimumQuantity: 30, description: "" }),
  new Product({ name: "Pincel 2 Polegadas", refCode: "PIN-024", category: getRandomCategory(), priceBaseSell: 15.00, priceBaseBuy: 15.00, minimumQuantity: 50, description: "" }),
  new Product({ name: "Broxa de Pintura", refCode: "BRO-025", category: getRandomCategory(), priceBaseSell: 8.00, priceBaseBuy: 8.00, minimumQuantity: 100, description: "" }),
  new Product({ name: "Fita Crepe 48mm", refCode: "FIT-026", category: getRandomCategory(), priceBaseSell: 6.00, priceBaseBuy: 6.00, minimumQuantity: 50, description: "" }),
  new Product({ name: "Espátula Aço 6 Polegadas", refCode: "ESP-027", category: getRandomCategory(), priceBaseSell: 12.00, priceBaseBuy: 12.00, minimumQuantity: 30, description: "" }),
  new Product({ name: "Torneira de Jardim", refCode: "TOR-028", category: getRandomCategory(), priceBaseSell: 25.00, priceBaseBuy: 25.00, minimumQuantity: 50, description: "" }),
  new Product({ name: "Válvula de Descarga", refCode: "VAL-029", category: getRandomCategory(), priceBaseSell: 180.00, priceBaseBuy: 180.00, minimumQuantity: 15, description: "" }),
  new Product({ name: "Chuveiro Elétrico", refCode: "CHU-030", category: getRandomCategory(), priceBaseSell: 90.00, priceBaseBuy: 90.00, minimumQuantity: 20, description: "" }),
  new Product({ name: "Ralo de Piso 10cm", refCode: "RAL-031", category: getRandomCategory(), priceBaseSell: 18.00, priceBaseBuy: 18.00, minimumQuantity: 50, description: "" }),
  new Product({ name: "Sifão Flexível", refCode: "SIF-032", category: getRandomCategory(), priceBaseSell: 22.00, priceBaseBuy: 22.00, minimumQuantity: 40, description: "" }),
  new Product({ name: "Luva PVC 25mm", refCode: "LUV-033", category: getRandomCategory(), priceBaseSell: 1.50, priceBaseBuy: 1.50, minimumQuantity: 100, description: "" }),
  new Product({ name: "Joelho PVC 90º", refCode: "JOE-034", category: getRandomCategory(), priceBaseSell: 2.00, priceBaseBuy: 2.00, minimumQuantity: 100, description: "" }),
  new Product({ name: "Adesivo para PVC 175g", refCode: "ADE-035", category: getRandomCategory(), priceBaseSell: 12.00, priceBaseBuy: 12.00, minimumQuantity: 50, description: "" }),
  new Product({ name: "Caixa de Gordura", refCode: "CXG-036", category: getRandomCategory(), priceBaseSell: 100.00, priceBaseBuy: 100.00, minimumQuantity: 10, description: "" }),
  new Product({ name: "Registro de Gaveta 25mm", refCode: "REG-037", category: getRandomCategory(), priceBaseSell: 25.00, priceBaseBuy: 25.00, minimumQuantity: 50, description: "" }),
  new Product({ name: "Porcelanato Polido 60x60", refCode: "POR-038", category: getRandomCategory(), priceBaseSell: 80.00, priceBaseBuy: 80.00, minimumQuantity: 30, description: "" }),
  new Product({ name: "Cuba de Inox", refCode: "CUB-039", category: getRandomCategory(), priceBaseSell: 200.00, priceBaseBuy: 200.00, minimumQuantity: 10, description: "" }),
  new Product({ name: "Misturador Monocomando", refCode: "MST-040", category: getRandomCategory(), priceBaseSell: 300.00, priceBaseBuy: 300.00, minimumQuantity: 5, description: "" }),
  new Product({ name: "Rodapé MDF 7cm", refCode: "ROD-041", category: getRandomCategory(), priceBaseSell: 12.00, priceBaseBuy: 12.00, minimumQuantity: 50, description: "" }),
  new Product({ name: "Parafuso Chipboard 4x50mm", refCode: "PAR-042", category: getRandomCategory(), priceBaseSell: 0.10, priceBaseBuy: 0.10, minimumQuantity: 1000, description: "" }),
  new Product({ name: "Trena de 5 Metros", refCode: "TRE-043", category: getRandomCategory(), priceBaseSell: 20.00, priceBaseBuy: 20.00, minimumQuantity: 30, description: "" }),
  new Product({ name: "Nível de Bolha", refCode: "NIV-044", category: getRandomCategory(), priceBaseSell: 35.00, priceBaseBuy: 35.00, minimumQuantity: 15, description: "" }),
  new Product({ name: "Martelo Unha 500g", refCode: "MAR-045", category: getRandomCategory(), priceBaseSell: 40.00, priceBaseBuy: 40.00, minimumQuantity: 20, description: "" }),
  new Product({ name: "Serra Circular 7 1/4 Polegadas", refCode: "SER-046", category: getRandomCategory(), priceBaseSell: 250.00, priceBaseBuy: 250.00, minimumQuantity: 10, description: "" }),
  new Product({ name: "Esquadro de Alumínio 30cm", refCode: "ESQ-047", category: getRandomCategory(), priceBaseSell: 25.00, priceBaseBuy: 25.00, minimumQuantity: 40, description: "" }),
  new Product({ name: "Carrinho de Mão", refCode: "CAR-048", category: getRandomCategory(), priceBaseSell: 180.00, priceBaseBuy: 180.00, minimumQuantity: 10, description: "" }),
  new Product({ name: "Corda de Sisal 10mm", refCode: "COR-049", category: getRandomCategory(), priceBaseSell: 1.50, priceBaseBuy: 1.50, minimumQuantity: 500, description: "" }),
  new Product({ name: "Betoneira 400L", refCode: "BET-050", category: getRandomCategory(), priceBaseSell: 3500.00, priceBaseBuy: 3500.00, minimumQuantity: 2, description: "" })
];

export const supplyList = Array.from({ length: getRandomNumber(1, 25) }, () => {

  const supplier = getRandomSupplier();
  const batches = getRandomBatches(supplier);

  return new Supply({ batches, description: "", supplier });
});


function getRandomDate(startDate) {
  const endDate = new Date();
  endDate.setFullYear(endDate.getFullYear() + 1); // 1 year from today
  return new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
}

function getRandomPrice(basePrice, variance = 0.2) {
  const minPrice = basePrice * (1 - variance);
  const maxPrice = basePrice * (1 + variance);
  return +(Math.random() * (maxPrice - minPrice) + minPrice).toFixed(2);
}

export function getRandomNumber(min = 1, max = 100) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomProduct() {

  const randomIndex = Math.floor(Math.random() * products.length);
  return products[randomIndex];
}

export function getRandomSupplier() {

  const randomIndex = Math.floor(Math.random() * suppliers.length);
  return suppliers[randomIndex];
}

export function getRandomCategory() {

  const randomIndex = Math.floor(Math.random() * categories.length);
  return categories[randomIndex];
}


export function getRandomBatches(supplier = null) {

  const length = getRandomNumber(1, 20);
  const batches = Array.from({ length }, () => {
    const product = getRandomProduct();
    return new Batch({
      product,
      expiry: getRandomDate(new Date()),
      priceBuy: getRandomPrice(product.priceBaseBuy),
      priceSell: getRandomPrice(product.priceBaseSell, 0.3),
      quantity: getRandomNumber(),
      supplier
    });
  });

  return batches;
}



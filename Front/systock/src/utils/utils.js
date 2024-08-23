import Batch from "../classes/Batch";
import { products, suppliers } from "./data";

export function deepCopy(object) {
  return JSON.parse(JSON.stringify(object));
}

export const generateID = () => Math.random().toString().slice(2);

export const states = [
  {name: "Acre", acronym: "AC"},
  {name: "Alagoas", acronym: "AL"},
  {name: "Amapá", acronym: "AP"},
  {name: "Amazonas", acronym: "AM"},
  {name: "Bahia", acronym: "BA"},
  {name: "Ceará", acronym: "CE"},
  {name: "Distrito Federal", acronym: "DF"},
  {name: "Espírito Santo", acronym: "ES"},
  {name: "Goiás", acronym: "GO"},
  {name: "Maranhão", acronym: "MA"},
  {name: "Mato Grosso", acronym: "MT"},
  {name: "Mato Grosso do Sul", acronym: "MS"},
  {name: "Minas Gerais", acronym: "MG"},
  {name: "Pará", acronym: "PA"},
  {name: "Paraíba", acronym: "PB"},
  {name: "Paraná", acronym: "PR"},
  {name: "Pernambuco", acronym: "PE"},
  {name: "Piauí", acronym: "PI"},
  {name: "Rio de Janeiro", acronym: "RJ"},
  {name: "Rio Grande do Norte", acronym: "RN"},
  {name: "Rio Grande do Sul", acronym: "RS"},
  {name: "Rondônia", acronym: "RO"},
  {name: "Roraima", acronym: "RR"},
  {name: "Santa Catarina", acronym: "SC"},
  {name: "São Paulo", acronym: "SP"},
  {name: "Sergipe", acronym: "SE"},
  {name: "Tocantins", acronym: "TO"}

];

export function formatDate(dateString = null) {
  if(dateString === null) return "";

  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  const formatDate = `${day}/${month}/${year}`;

  return formatDate;
}

export function convertMsToDay(ms) {
  const millisecondsInADay = 24 * 60 * 60 * 1000;

  const days = ms / millisecondsInADay;

  return days;
}
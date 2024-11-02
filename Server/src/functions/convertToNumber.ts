export default function convertStringToNumber(phase: string){
    try {
        const convertToNumber = Number(phase);
        if(isNaN(convertToNumber)){
            throw new Error("Expected a number and received a string")
        }
        return convertToNumber
    } catch (error) {
        throw error;
    }
}
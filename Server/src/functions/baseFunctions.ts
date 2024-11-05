export function dateBase(){
    return new Date("2024-01-01T00:00:01.000");
};
export function convertStringToNumber(phase: string){
    try {
        const convertToNumber = Number(phase);
        if(isNaN(convertToNumber)){
            throw new Error("Expected a number and received a string")
        }
        return convertToNumber
    } catch (error) {
        throw error;
    };
};
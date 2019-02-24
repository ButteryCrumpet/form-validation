



type maxLength = (max: number) => (x: string) => boolean;
export const maxLength: maxLength = max => x => x.length <= max;
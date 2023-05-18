// This function *is* inclusive of both the min and max numbers

export const randomInt = (min: number, max: number) => {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

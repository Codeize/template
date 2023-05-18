export const titleCase = (string: string): string => {
	return string
		.replace(/[-_]/g, " ")
		.toLowerCase()
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ")
}

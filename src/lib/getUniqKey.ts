let id = 0;

const getUniqKey = (): string => {
	id += 1;
	return `${id}`;
};

export default getUniqKey;

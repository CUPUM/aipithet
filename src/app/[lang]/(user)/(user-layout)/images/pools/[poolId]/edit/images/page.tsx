async function getImages(poolId: string) {
	console.log(poolId);
}

export default async function Page(props: { params: { poolId: string } }) {
	const images = await getImages(props.params.poolId);
	console.log(images);
	return <>Hello images</>;
}

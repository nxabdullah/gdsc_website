import { Box, Grid2 as Grid } from '@mui/material';
import { getData, parseWorkshops } from '~/app/api/workshops/getWorkshopData';
import { InfoCard, TableOfContents, WorkshopSearch, FilteredWorkshopWidget } from '~/components/client';
import { ConvertDate, workshopHash } from '~/components/server';

const _LatestWorkshops = async ({ workshops, limit, showDate = false }) => (
	<Grid container spacing={2} sx={{ mb: 4 }}>
		{Object.keys(workshops)
			.reduce((acc, key) => {
				return [...acc, ...workshops[key]];
			}, [])
			.sort((a, b) => {
				return new Date(b.date) - new Date(a.date);
			})
			.slice(0, limit)
			.map((item, index) => {
				return (
					<Grid size={{ md: 4 }} key={index}>
						<InfoCard
							subtitle={showDate ? ConvertDate({ date: item.date }) : undefined}
							title={item.name}
							href={`/past-workshops#${workshopHash(item.name, item.date)}`}
							description={item.description}
							lines={2}
							external={false}
						/>
					</Grid>
				);
			})}
	</Grid>
);

const WorkshopList = async ({ workshops }) => {
	return (
		<Grid container spacing={2}>
			<Grid size={{ md: 3 }}>
				<TableOfContents />
			</Grid>
			<Grid size={{ md: 9 }}>
				<WorkshopSearch />

				{Object.keys(workshops).map((category, index) => {
					return (
						<Box key={index}>
							<h2 className="resources" id={category.replace(/\s/g, '')}>
								{category}
							</h2>
							{workshops[category]
								.sort((a, b) => {
									return new Date(b.date) - new Date(a.date);
								})
								.map((item, index) => {
									return <FilteredWorkshopWidget key={index} item={item} />;
								})}
						</Box>
					);
				})}
			</Grid>
		</Grid>
	);
};

export const LatestWorkshops = async ({ limit, ...props }) => {
	const workshops = parseWorkshops(await getData());

	return <_LatestWorkshops workshops={workshops} limit={limit} {...props} />;
};

export const WorkshopArchiveInfo = async () => {
	const workshops = parseWorkshops(await getData());

	return (
		<>
			<_LatestWorkshops workshops={workshops} limit={3} />
			<WorkshopList workshops={workshops} />
		</>
	);
};

const launchesDatabase = require('./lauches.mongo');
const planets = require('./planets.mongo');

const launches = new Map();

let latestFlightNumber = 100;

const launch = {
  flightNumber: 100,
  mission: 'Kepler Exporation X',
  rocket: 'Explorer IS1',
  launchDate: new Date('December 27, 2030'),
  target: 'Kepler-442 b',
  customers: ['SpaceX', 'NASA'],
  upcoming: true,
  success: true,
};

saveLaunch(launch);

function existsLaunchWithId(launchId) {
  return launches.has(launchId);
}

async function getAllLaunches() {
  return await launchesDatabase.find({}, { _id: 0, __v: 0 });
}

async function saveLaunch(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target,
  });

  if (!planet) {
    throw new Error('No matching planet found');
  }

  await launchesDatabase.updateOne(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
}

function addNewlaunch(launch) {
  latestFlightNumber++;
  launches.set(
    latestFlightNumber,
    Object.assign(launch, {
      success: true,
      upcoming: true,
      customers: ['NASA', 'SpaceX'],
      flightNumber: latestFlightNumber,
    })
  );
}

function abortLaunchById(launchId) {
  const aborted = launches.get(launchId);
  aborted.upcoming = false;
  aborted.success = false;
  return aborted;
}

module.exports = {
  existsLaunchWithId,
  getAllLaunches,
  addNewlaunch,
  abortLaunchById,
};

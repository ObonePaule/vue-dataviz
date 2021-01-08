import axios from 'axios'
import { ObjectFound, Station, Frequentation } from './../types'

const API_HOST_BASE = "https://data.sncf.com/api/records/1.0/search/"

export async function getStations(rows = 100) {
  const STATIONS_API = `?dataset=referentiel-gares-voyageurs&q=&rows=${rows}&sort=gare_alias_libelle_noncontraint&facet=departement_libellemin&facet=segmentdrg_libelle&facet=gare_agencegc_libelle&facet=gare_regionsncf_libelle&facet=gare_ug_libelle`
  const response = await axios.get(API_HOST_BASE + STATIONS_API)
  const stations = response.data.records.map(record => new Station(record.fields)).filter(station => station.haveCoords)

  return stations
}

const groupBy = (array, key) => {
  return array.reduce((result, currentValue) => {
    (result[currentValue[key]] = result[currentValue[key]] || []).push(
      currentValue
    );
    return result
  }, {})
}

export async function getLostObjects(year, month, rows = 1000) {
  const LOST_OBJECTS_API = `?dataset=objets-trouves-restitution&q=&rows=${rows}&sort=date&facet=date&refine.date=${year}-${month}`
  const response = await axios.get(API_HOST_BASE + LOST_OBJECTS_API)
  const objects =  response.data.records.map(object => new ObjectFound(object.fields))
  const objectsGroupedByDate = groupBy(objects, 'date')
  const objectsGroupedByStationName = groupBy(objects, 'stationName')

  return {
    'byDate': objectsGroupedByDate,
    'byStationName': objectsGroupedByStationName,
  }
}

export async function getStationFrequentations(stationUICCode) {
  const STATION_FREQUENTATION_API = `?dataset=frequentation-gares&q=&facet=code_uic_complet&refine.code_uic_complet=${stationUICCode.split('00')[1]}`
  const response = await axios.get(API_HOST_BASE + STATION_FREQUENTATION_API)
  const frequentations = response.data.records.map(record => new Frequentation(record.fields))

  return frequentations[0]
}

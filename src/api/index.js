import axios from 'axios'

const API_HOST_BASE = "https://data.sncf.com/api/records/1.0/search/"

import { Station } from './../types'

export async function getStations() {
    // const rows = 2867
    const rows = 50
    const STATIONS_API = `?dataset=referentiel-gares-voyageurs&q=&rows=${rows}&sort=gare_alias_libelle_noncontraint&facet=departement_libellemin&facet=segmentdrg_libelle&facet=gare_agencegc_libelle&facet=gare_regionsncf_libelle&facet=gare_ug_libelle`
    const response = await axios.get(API_HOST_BASE + STATIONS_API)
    const stations = response.data.records.map(record => new Station(record.fields)).filter(station => station.haveCoords)
    console.log(response.data.records)

    return stations
}

export async function getLostObjects() {
    const LOST_OBJECTS_API = "..."
    const response = await axios.get(API_HOST_BASE + LOST_OBJECTS_API)

    console.log(response)
}

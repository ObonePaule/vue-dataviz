import axios from 'axios'

const API_HOST_BASE = "https://data.sncf.com/api/records/1.0/search/"

export async function getStations() {
    const STATIONS_API = "?dataset=referentiel-gares-voyageurs&q=&sort=gare_alias_libelle_noncontraint&facet=departement_libellemin&facet=segmentdrg_libelle&facet=gare_agencegc_libelle&facet=gare_regionsncf_libelle&facet=gare_ug_libelle"
    const response = await axios.get(API_HOST_BASE + STATIONS_API)

    console.log(response)
}

export async function getLostObjects() {
    const LOST_OBJECTS_API = "..."
    const response = await axios.get(API_HOST_BASE + LOST_OBJECTS_API)

    console.log(response)
}

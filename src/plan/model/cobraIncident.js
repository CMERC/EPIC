export default class CobraIncident {
    constructor() {
        this.resetData()
    }
    resetData() {
        this.ProjectGUID = ''
        this.ProjectName = ''
        this.ProjectDescription = ''
        this.CreatedByUserGUID = ''
        this.OrganizationName = ''
        this.UrlEncodedOrgName = ''
        this.Lat = 0
        this.Lon = 0
        this.Street1 = ''
        this.Street2 = ''
        this.City = ''
        this.State_Province = ''
        this.Zip_PostalCode = ''
        this.Country = ''
        this.County_Region = ''
        this.IsPrivate = ''
        this.CreatedByClient = ''
        this.ProjectStartDate = ''
        this.UnixStartDate = 0
        this.IsActive = ''
        this.ProjectType = ''
        this.XMLData = ''
        this.GeoDataKML = ''
        this.IncidentTypeGUID = ''
        this.IncidentCategoryGUIDs = ''
        this.IncidentCategoryAsGuids = []
        this.UniqueID = ''
        this.What3Words = ''
        this.ExerciseTypeGUID = ''
        this.AssociatedUser = ''
        this.ProjectEndDate = ''
        this.ProjectLocation = {}
        this.TranslatedProjectType = ''
        this.IsConfigProject = ''
        this.DateCreated = ''
        this.FormattedDateCreated = ''
        this.UnixDateCreated = ''
        this.DateLastModified = ''
        this.FormattedDateLastModified = ''
        this.UnixDateLastModified = 0
        this.ClusterId = 0
    }
}
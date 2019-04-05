import {DataAdapter} from "./DataAdapter";

describe('DataAdapter',  ()=>  {
    it('should return one entry when given a jira issue entry that is created and resolved on the same day', () => {
        const jiraIssue = {
            "expand": "names,schema",
            "startAt": 0,
            "maxResults": 1,
            "total": 160,
            "issues": [
                {
                    "expand": "operations,versionedRepresentations,editmeta,changelog,renderedFields",
                    "id": "100136",
                    "self": "",
                    "key": "JIRA-161",
                    "fields": {
                        "resolutiondate": "2019-02-08T12:30:53.000+0100",
                        "created": "2019-02-08T12:20:36.000+0100"
                    }
                }
            ]
        }
        const result = new DataAdapter().convert(jiraIssue);
        expect(result).toEqual([{date:"2019-02-08",averageLeadTime:0}])
    });
    it('should return two entries when given two jira issue entries on that have been created and resolved on consequtive dates', () => {
        const jiraIssue = {
            "expand": "names,schema",
            "startAt": 0,
            "maxResults": 1,
            "total": 160,
            "issues": [
                {
                    "expand": "operations,versionedRepresentations,editmeta,changelog,renderedFields",
                    "id": "100136",
                    "self": "",
                    "key": "JIRA-161",
                    "fields": {
                        "resolutiondate": "2019-02-08T12:30:53.000+0100",
                        "created": "2019-02-08T12:20:36.000+0100"
                    }
                },
                {
                    "expand": "operations,versionedRepresentations,editmeta,changelog,renderedFields",
                    "id": "100136",
                    "self": "",
                    "key": "JIRA-162",
                    "fields": {
                        "resolutiondate": "2019-02-09T12:30:53.000+0100",
                        "created": "2019-02-09T12:20:36.000+0100"
                    }
                }
            ]
        }
        const result = new DataAdapter().convert(jiraIssue);
        expect(result).toEqual([{date:"2019-02-08",averageLeadTime:0},{date:"2019-02-09",averageLeadTime:0}])
    });
    it('should return the same number of date entries for every date between creation and resolution date of jira issue entry',  () => {
        const jiraIssue = {
            "expand": "names,schema",
            "startAt": 0,
            "maxResults": 1,
            "total": 160,
            "issues": [
                {
                    "expand": "operations,versionedRepresentations,editmeta,changelog,renderedFields",
                    "id": "100136",
                    "self": "",
                    "key": "JIRA-161",
                    "fields": {
                        "resolutiondate": "2019-02-20T12:30:53.000+0100",
                        "created": "2019-02-08T12:20:36.000+0100"
                    }
                }
            ]
        }

        const result = new DataAdapter().convert(jiraIssue);

        expect(result.length).toEqual(13)

    });
    it('should return the same number of date entries for every date between creation and resolution date of two jira issue entries whos dates are the same',  () => {
        const jiraIssue = {
            "expand": "names,schema",
            "startAt": 0,
            "maxResults": 1,
            "total": 160,
            "issues": [
                {
                    "expand": "operations,versionedRepresentations,editmeta,changelog,renderedFields",
                    "id": "100136",
                    "self": "",
                    "key": "JIRA-161",
                    "fields": {
                        "resolutiondate": "2019-02-20T12:30:53.000+0100",
                        "created": "2019-02-08T12:20:36.000+0100"
                    }
                },
                {
                    "expand": "operations,versionedRepresentations,editmeta,changelog,renderedFields",
                    "id": "100136",
                    "self": "",
                    "key": "JIRA-161",
                    "fields": {
                        "resolutiondate": "2019-02-20T12:30:53.000+0100",
                        "created": "2019-02-18T12:20:36.000+0100"
                    }
                }
            ]
        }

        const result = new DataAdapter().convert(jiraIssue);

        expect(result.length).toEqual(13)

    });

    it('should return the same number of date entries for every date between creation and resolution date of two jira issue entries whos dates overlap',  () => {
        const jiraIssue = {
            "expand": "names,schema",
            "startAt": 0,
            "maxResults": 1,
            "total": 160,
            "issues": [
                {
                    "expand": "operations,versionedRepresentations,editmeta,changelog,renderedFields",
                    "id": "100136",
                    "self": "",
                    "key": "JIRA-161",
                    "fields": {
                        "resolutiondate": "2019-02-10T12:30:53.000+0100",
                        "created": "2019-01-08T12:20:36.000+0100"
                    }
                },
                {
                    "expand": "operations,versionedRepresentations,editmeta,changelog,renderedFields",
                    "id": "100136",
                    "self": "",
                    "key": "JIRA-161",
                    "fields": {
                        "resolutiondate": "2019-03-20T12:30:53.000+0100",
                        "created": "2019-02-08T12:20:36.000+0100"
                    }
                }
            ]
        }

        const result = new DataAdapter().convert(jiraIssue);
        expect(result.length).toEqual(72)

    });

    it('should return the same number of date entries for every date between creation and resolution date of two jira issue entries whos dates dont overlap',  () => {
        const jiraIssue = {
            "expand": "names,schema",
            "startAt": 0,
            "maxResults": 1,
            "total": 160,
            "issues": [
                {
                    "expand": "operations,versionedRepresentations,editmeta,changelog,renderedFields",
                    "id": "100136",
                    "self": "",
                    "key": "JIRA-161",
                    "fields": {
                        "resolutiondate": "2019-02-10T12:30:53.000+0100",
                        "created": "2019-01-08T12:20:36.000+0100"
                    }
                },
                {
                    "expand": "operations,versionedRepresentations,editmeta,changelog,renderedFields",
                    "id": "100136",
                    "self": "",
                    "key": "JIRA-161",
                    "fields": {
                        "resolutiondate": "2019-03-20T12:30:53.000+0100",
                        "created": "2019-02-19T12:20:36.000+0100"
                    }
                }
            ]
        }

        const result = new DataAdapter().convert(jiraIssue);
        expect(result.length).toEqual(72)

    });

});

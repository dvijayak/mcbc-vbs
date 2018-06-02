export class AppConfig {
    private _title: string;
    public get title(): string {
        return this._title;
    }

    constructor(json: any) {
        this.updateFromJSON(json);
    }

    public updateFromJSON(json: any): void {
        if (!json) {
            return;
        }

        if (json.hasOwnProperty('title')) {
            this._title = json['title'].toString();
        }
    }
}

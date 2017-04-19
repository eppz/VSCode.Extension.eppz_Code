import * as vscode from 'vscode';
import Analytics from 'electron-google-analytics';
import { Data } from './Data';


export class GoogleAnalytics
{


    // Singleton.
    private static instance: GoogleAnalytics;
    static CreateInstanceWithContext(context: vscode.ExtensionContext)
    { GoogleAnalytics.instance = new GoogleAnalytics(context); }
    static Instance()
    { return GoogleAnalytics.instance; }

    // Settings.
    private static Disabled()
    { return (vscode.workspace.getConfiguration('eppz-code')['disableAnalytics'] == true); }


    context: vscode.ExtensionContext;
    tracker: Analytics;


    // Custom Dimension `UUID` (Index: 1, Scope: User).
    static CustomDimension_1(): string
    { return Data.Instance().UUID; }

    // Custom Dimension `Color Theme` (Index: 2, Scope: Hit).
    static CustomDimension_2(): string
    { return vscode.workspace.getConfiguration('workbench')['colorTheme']; }    
    

    private constructor(context: vscode.ExtensionContext)
    {
         this.context = context;
         if (GoogleAnalytics.Disabled()) return;
         this.tracker = new Analytics('UA-37060479-24');
    }

    public static AppEvent(action: string, label: string = null)
    { GoogleAnalytics.Event('App', action, label); }

    public static ReviewEvent(action: string, label: string = null)
    { GoogleAnalytics.Event('Review', action, label); }

    private static Event(category: string, action: string, label: string = null)
    {
        if (GoogleAnalytics.Disabled()) return;
        let params =
        {
            ec: category,
            ea: action,
            el: label,
            cd1: GoogleAnalytics.CustomDimension_1(),
            cd2: GoogleAnalytics.CustomDimension_2()
        };
        GoogleAnalytics.instance.tracker.send('event', params, Data.Instance().UUID)
            .then((response) => { return response; })
            .catch((error) => { return error; });
    }
}
export type Kind = 'main' | 'followup' | 'code';
export type Skill = 'recognize' | 'explain' | 'implement';
export type Score = 0 | 1 | 2;
export type Ratings = Partial<Record<Skill, Score>>;
export interface TextDocument {text: string; at: number}
export interface Progress {stage:number; phase:'main'|'followup'; reviews:number; firstSeen:number; lastReviewed:number; due:number}
export interface ReviewState {version:1; records:Record<string,Progress>; skills:Record<string,Partial<Record<Skill,{value:Score;at:number}>>>; notes:Record<string,TextDocument>}
export interface Settings {dailyNewLimit:number;topicId:string}
export interface Snapshot {state:ReviewState; drafts:Record<string,TextDocument>; settings:Settings; revision:number; databaseId:string; result?:{label:string;eventId?:string}}
export interface Session {apiVersion:number;token:string;timeZone?:string;serverNow?:number;dataDirectory?:string}
export interface Card {uid:string;id:number;group:string;title:string;level:string;prompt:string;example:string;hint:string;recognition:string;mnemonic:string;why:string;invariant:string;steps:string[];trace:string;traceLabel?:string;trap:string;complexity:string;prerequisites:string[];related:{id:number;kind?:string;why:string}[];followup:{prompt:string;answer:string};code:string;codeNote?:string;url:string;noteUrl:string}
export interface Concept {id:string;title:string;explanation:string;example:string}
export interface Topic {id:string;number:string;title:string;connectionRule:string;cards:Card[];concepts:Concept[];groups:{id:string;title:string;description:string}[]}
export interface Library {version:number;topics:Topic[]}
export interface HistoryEvent {id:string;uid:string;at:number;kind:Kind;practice:boolean;ratings:Ratings;usedHelp:boolean;due?:number;undone:boolean;canUndo:boolean}
export interface HistoryPage {events:HistoryEvent[];nextCursor:number|null}
export interface Problem {uid:string;learned:boolean;eventCount:number;legacyCount:number;firstAt:number|null;lastAt:number|null;activityDays:string[]}
export interface Learning extends Snapshot {generatedAt:number;problems:Problem[];days:{date:string;total:number;new:number;review:number;practice:number;submissions:number}[];today:HistoryEvent[];recent:HistoryEvent[]}
export interface Backup {at:number;bytes:number;name:string}
export interface DatabaseStatus {startedCount:number;reviewCount:number;databasePath:string;backupPath:string;backupError?:string;backups:Backup[]}
export type CommandType = 'review'|'undo'|'note'|'draft'|'settings'|'import'|'migrate'|'restore';
export interface Payload {uid?:string;kind?:Kind;text?:string;expectedAt?:number|null;overwrite?:boolean;[key:string]:unknown}
export interface ConflictError {message:string;status:number;detail?:{conflict?:string;databaseText?:string;yourText?:string;[key:string]:unknown}}
export interface Operation {id:string;type:CommandType;payload:Payload;databaseId?:string;sent?:boolean;body?:string;error?:ConflictError}
export interface Attempt {uid:string;kind:Kind;practice:boolean;operationId:string;revealed:boolean;hintLevel:number;usedHelp:boolean;ratings:Ratings}
export interface Filters {query:string;topic:string;status:string;from:string;to:string;sort:string}
export interface TopicCard extends Card {topicId:string;topicTitle:string}
export interface LearningRow extends Problem {card:{uid:string;id:number|string;title:string;topicTitle:string;topicId?:string};status:string;record?:Progress}
export interface LearningModel {rows:LearningRow[];due:TopicCard[];fresh:TopicCard[];done:(HistoryEvent&{card?:TopicCard})[];topics:(Topic&{learned:number})[];remaining:number;introduced:number;overdue:number;learned:number;submissions:number}

import type {EdgeEventConfig} from "../adapter";

export interface NodeData {
    id: string;
    type?: string;
    text?: NodeDataText;
    properties?: NodePropertie;
    events: EdgeEventConfig[];
    expression: string
}

export interface NodeDataText {
    value?: string;
}

export interface NodePropertie {
    value?: string;
    code?: string;
    auth?: string; // no,yes,noshow
    candidateGroups?: string; //角色Code,以逗号分隔
}

// export interface NodeEvnts {
//     event?: string;  // beforeComplete,complete
//     type?: string;
//     action?: string;
//     url?: string;
//     classType?: string;
//     page?: string
//     className?: string; //java class
// }
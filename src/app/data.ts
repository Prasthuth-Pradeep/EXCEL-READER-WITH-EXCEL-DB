export interface IData {
    Name:string,
    API_Name: string,
    Memory: string,
    Compute_Units_ECU: string,
    vCPUs: string,
    GiB_of_Memory_per_vCPU: string,
    GPUs: string,
    GPU_model: string,
    GPU_memory: string,
    CUDA_Compute_Capability: string,
    FPGAs:string,
    ECU_per_vCPU: string,
    Physical_Processor: string,
    Clock_Speed_GHz: string,
    Instance_Storage: string,
    Instance_Storage_already_warmed_up: string,
    Instance_Storage_SSD_TRIM_Support: string,
    Arch: string,
    Network_Performance: string,
    EBS_Optimized_Max_Bandwidth:string,
    EBS_Optimized_Max_Throughput_128: string,
    EBS_Optimized_Max_IOPS_16K: string,
    EBS_Exposed_as_NVMe: string,
    Max_IPs: string
    Max_ENIs: string,
    Enhanced_Networking: string,
    VPC_Only: string,
    IPv6_Support: string,
    Placement_Group_Support: string,
    Linux_Virtualization: string,
    On_EMR: string,
    Availability_Zones: string,
    Linux_On_Demand_cost: string,
    Linux_Reserved_cost: string,
    Linux_Spot_Minimum_cost: string,
    Linux_Spot_Maximum_cost: string,
    RHEL_On_Demand_cost: string,
    RHEL_Reserved_cost: string,
    RHEL_Spot_Minimum_cost: string,
    RHEL_Spot_Maximum_cost: string,
    SLES_On_Demand_cost: string,
    SLES_Reserved_cost: string,
    SLES_Spot_Minimum_cost: string,
    SLES_Spot_Maximum_cost: string,
    Windows_On_Demand_cost: string,
    Windows_Reserved_cost: string,
    Windows_Spot_Minimum_cost: string,
    Windows_Spot_Maximum_cost: string,
    Windows_SQL_Web_On_Demand_cost: string,
    Windows_SQL_Web_Reserved_cost: string,
    Windows_SQL_Std_On_Demand_cost: string,
    Windows_SQL_Std_Reserved_cost: string,
    Windows_SQL_Ent_On_Demand_cost: string,
    Windows_SQL_Ent_Reserved_cost: string,
    Linux_SQL_Web_On_Demand_cost: string,
    Linux_SQL_Web_Reserved_cost:string,
    Linux_SQL_Std_On_Demand_cost: string,
    Linux_SQL_Std_Reserved_cost: string,
    Linux_SQL_Ent_On_Demand_cost: string,
    Linux_SQL_Ent_Reserved_cost: string,
    EBS_Optimized_surcharge: string,
    EMR_cost: string,
    Windows_On_Demand_cost_Check: number,
    serverId: number
}

export interface ISearchData{
    serverId: number,
    serverName: string,
    vCPUs: string,
    memoryInGB: string,
    storageInGB: number,
    IOPS: number,
    OSFamily: any,
    OS: string
}

export interface IResultData{
    API_Name: string,
    Memory: string,
    vCPUs: string,
    Physical_Processor: string,
    Windows_On_Demand_cost?: number,
    Linux_On_Demand_cost?: number
}
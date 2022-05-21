import { IData, IResultData, ISearchData } from './../data';
import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { newArray } from '@angular/compiler/src/util';

@Component({
  selector: 'app-file-reader',
  templateUrl: './file-reader.component.html',
  styleUrls: ['./file-reader.component.scss']
})
export class FileReaderComponent implements OnInit {

  lastData: IData[] = [];
  extracedData!: IData[];
  searchData!: ISearchData[];
  onSelectData!: string;
  findingData!: IData[];
  onSelectDataFind!: string;
  data: any;
  resultData: IResultData[] = [];
  constructor(private searchFormFormBuilder: FormBuilder,
    private http: HttpClient) {
  }

  async ngOnInit(): Promise<void> {

    this.read()
  }

  read() {
    this.http.get('assets/DB_EXCEL_SHEET/amazon_ec2_instance_comparison.xlsx', { responseType: 'blob' })
      .subscribe((data: any) => {
        this.fileUpload(data)
      });
  }

  fileUpload(event: any) {
    // const selectedFile = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(event);
    fileReader.onload = (event) => {
      let binayData = event.target?.result;
      let workBook = XLSX.read(binayData, { type: 'binary' });
      workBook.SheetNames.forEach(sheet => {
        const data: IData[] = XLSX.utils.sheet_to_json(workBook.Sheets[sheet])
        this.extracedData = data;
      })
    }
  }

  onSearch(event: any) {
    const selectedFile = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(selectedFile);
    fileReader.onload = (event) => {
      let binayData = event.target?.result;
      let workBook = XLSX.read(binayData, { type: 'binary' });
      workBook.SheetNames.forEach(sheet => {
        const data: ISearchData[] = XLSX.utils.sheet_to_json(workBook.Sheets[sheet]);
        this.searchData = data
        this.searchData.forEach((data: ISearchData) => {
          // this.onFindInstance(data.vCPUs, data.memoryInGB, data.OSFamily, data.serverId);
        });
      })
    }
  }

  onFindInstance(vCPUsSize: any, memoryInGB: any, OSFamily: any, serverId: number) {
      let vCPUsResult: IData[] = this.extracedData.filter((vCPUs) => vCPUs?.vCPUs?.toLowerCase().match(vCPUsSize));
      let memoryResult: IData[] = vCPUsResult.filter((Memory) => Memory?.Memory?.toLowerCase().match(memoryInGB));
      this.findingData = [...new Set([...memoryResult])];
      this.findingData.forEach((data) => {
        data.serverId = serverId;
      })
      if (OSFamily == 'Windows') {
        const WDcost = this.findingData.map(object => {
          return +object.Windows_On_Demand_cost;
        });
        const newWDcostArray = WDcost.filter(function (value) {
          return !Number.isNaN(value);
        });
        const WDcostmin = Math.min(...newWDcostArray);
        const WDcostMinStr = '' + WDcostmin;
        let finalArray: IData[] = this.findingData.filter((Windows_On_Demand_cost) => Windows_On_Demand_cost?.Windows_On_Demand_cost?.toString().toLowerCase().match(WDcostMinStr));
        this.lastData = [...new Set([...finalArray])];
      }
      else if (OSFamily == 'Linux') {
      const LXcost = this.findingData.map(object => {
        return +object.Linux_On_Demand_cost;
      });
      const newLXcostArray = LXcost.filter((value) => {
        return !Number.isNaN(value);
      });
      const LXcostmin = Math.min(...newLXcostArray);
      const LXcostminStr = '' + LXcostmin;
      let finalArray: IData[] = this.findingData.filter((Linux_On_Demand_cost) => Linux_On_Demand_cost?.Linux_On_Demand_cost?.toString().toLowerCase().match(LXcostminStr));
      this.lastData = [...new Set([...finalArray])];
    }
  }

  onInstance(instanceName: string) {
    this.onSelectData = instanceName
  }

  onInstanceFind(instanceName: string) {
    this.onSelectDataFind = instanceName
  }

}
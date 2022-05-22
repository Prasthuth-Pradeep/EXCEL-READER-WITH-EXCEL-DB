import { ICombo, IData, IResultData, ISearchData } from './../data';
import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-file-reader',
  templateUrl: './file-reader.component.html',
  styleUrls: ['./file-reader.component.scss']
})
export class FileReaderComponent implements OnInit {

  extracedExcelData!: IData[];
  searchData!: ISearchData[];
  filteredData!: IData[];
  memoryList: number[] = [];
  cpuList: number[] = [];
  resultData: IResultData[] = [];
  dataForm: FormGroup;
  sortedData: IData[] = [];
  closestCPU!: number;
  closestMEMORY!: number;
  searchCombo: ICombo[] = [];
  comboList: any[] = [];
  constructor(private cpuFormBuiilder: FormBuilder,
    private http: HttpClient) {
    this.dataForm = this.cpuFormBuiilder.group({
      memory: [],
      cpu: []
    });
  }

  async ngOnInit(): Promise<void> {

    this.getExcelData()
  }

  getExcelData() {
    this.http.get('assets/DB_EXCEL_SHEET/amazon_ec2_instance_comparison.xlsx', { responseType: 'blob' })
      .subscribe((data: any) => {
        this.readExcel(data)
      });
  }

  readExcel(event: any) {
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(event);
    fileReader.onload = (event) => {
      let binayData = event.target?.result;
      let workBook = XLSX.read(binayData, { type: 'binary' });
      workBook.SheetNames.forEach(sheet => {
        const data: IData[] = XLSX.utils.sheet_to_json(workBook.Sheets[sheet])
        this.extracedExcelData = data;
        // console.log(this.extracedExcelData)
        this.extracedExcelData.forEach((el) => {
          this.findMemoryList(el.Memory)
          this.findCpuList(el.vCPUs)
          this.findCombo(+el.Memory.replace(/[a-zA-Z](.*)/g, ''), +el.vCPUs.replace(/[a-zA-Z](.*)/g, ''))
        })
      })
    }
  }

  findCombo(memory: any, cpu: any) {
    let COMBO: ICombo = {
      memory: memory,
      cpu: cpu
    }
    this.searchCombo.push(...[COMBO])
    console.log(this.searchCombo)
  }

  findMemoryList(memory: any) {
    const MEMORY = +memory.replace(/[a-zA-Z](.*)/g, '')
    this.memoryList.push(MEMORY);
    // Removing dup
    this.memoryList = this.memoryList.filter((item, index, inputArray) => {
      return inputArray.indexOf(item) == index;
    });
    // Acc order
    this.memoryList = this.memoryList.sort((a, b) => {
      return a - b;
    });
  }

  findCpuList(cpu: any) {
    const CPU = +cpu.replace(/[a-zA-Z](.*)/g, '')
    this.cpuList.push(CPU);
    this.cpuList = this.cpuList.filter((item, index, inputArray) => {
      return inputArray.indexOf(item) == index;
    });
    this.cpuList = this.cpuList.sort((a, b) => {
      return a - b;
    });
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
        console.log(this.searchData)
        this.searchData.forEach((data: ISearchData) => {
          // console.log(data.vCPUs)
          // this.onFindInstance(data.vCPUs, data.memoryInGB, data.OSFamily, data.serverId);
        });
      })
    }
  }

  onFindInstance(vCPUsSize: any, memoryInGB: any, OSFamily: any, serverId: number) {
    let vCPUsSizeONE = vCPUsSize + 3;
    let memoryInGBONE = memoryInGB + 3;
    if (this.cpuList.indexOf(vCPUsSizeONE) !== -1) {
      vCPUsSizeONE = vCPUsSizeONE;
    } else {
      this.findClosestCPU(vCPUsSizeONE);
      vCPUsSizeONE = this.closestCPU;
    }
    if (this.memoryList.indexOf(memoryInGBONE) !== -1) {
      memoryInGBONE = memoryInGBONE;
    } else {
      this.findClosestMemory(memoryInGBONE);
      memoryInGBONE = this.closestMEMORY;
    }
    this.dataForm.controls['memory'].setValue(memoryInGBONE);
    this.dataForm.controls['cpu'].setValue(vCPUsSizeONE);
    let vCPUsResult: IData[] = this.extracedExcelData.filter((vCPUs) => vCPUs?.vCPUs?.toLowerCase().includes(this.dataForm.controls.cpu.value));
    let memoryResult: IData[] = vCPUsResult.filter((Memory) => Memory?.Memory?.toLowerCase().includes(this.dataForm.controls.memory.value));
    this.filteredData = [...new Set([...memoryResult])];
    // this.filteredData.forEach((data) => {
    //   data.serverId = serverId;
    // })
    if (OSFamily == 'Windows') {
      const WDcost = this.filteredData.map((object) => {
        return +object.Windows_On_Demand_cost;
      });
      const newWDcostArray = WDcost.filter((value) => {
        return !Number.isNaN(value);
      });
      const WDcostmin = Math.min(...newWDcostArray);
      const WDcostMinStr = '' + WDcostmin;
      let finalArray: IData[] = this.filteredData.filter((Windows_On_Demand_cost) => Windows_On_Demand_cost?.Windows_On_Demand_cost?.toString().toLowerCase().match(WDcostMinStr));
      this.sortedData = [...new Set([...finalArray])];
      // console.log(this.sortedData)
    }
    else if (OSFamily == 'Linux') {
      const LXcost = this.filteredData.map(object => {
        return +object.Linux_On_Demand_cost;
      });
      const newLXcostArray = LXcost.filter((value) => {
        return !Number.isNaN(value);
      });
      const LXcostmin = Math.min(...newLXcostArray);
      const LXcostminStr = '' + LXcostmin;
      let finalArray: IData[] = this.filteredData.filter((Linux_On_Demand_cost) => Linux_On_Demand_cost?.Linux_On_Demand_cost?.toString().toLowerCase().match(LXcostminStr));
      this.sortedData = [...new Set([...finalArray])];
    }
  }

  findClosestCPU(cpu: number) {
    if (this.cpuList == null) {
      return
    }
    let closest = this.cpuList[0];
    console.log('closest :' + closest)
    for (let item of this.cpuList) {
      if (Math.abs(item - cpu) < Math.abs(closest - cpu)) {
        console.log('item :' + item)
        closest = item;
      }
    }
    // console.log('closest CPU :' + closest)
    return this.closestCPU = closest;
  }

  findClosestMemory(memory: number) {
    if (this.memoryList == null) {
      return
    }
    let closest = this.cpuList[0];
    for (let item of this.memoryList) {
      if (Math.abs(item - memory) < Math.abs(closest - memory)) {
        closest = item;
      }
    }
    // console.log('closest memory :' + closest)
    return this.closestMEMORY = closest;
  }

}
import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Observable, tap} from "rxjs";
import {ModelsService} from "../../services/models.service";
import {Model} from "../../models/model.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-models-list',
  templateUrl: './models-list.component.html',
  styleUrls: ['./models-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModelsListComponent implements OnInit {

  loading$!: Observable<boolean>;
  models$!: Observable<Model[]>;
  isFormActivated: boolean = false;




  constructor(private modelsService: ModelsService,
              private router: Router) { }

  ngOnInit(): void {
    this.initObservables();
    this.modelsService.getModelsFromServer();
  }

  private initObservables() {
    this.loading$ = this.modelsService.loading$;
    this.models$ = this.modelsService.models$;
  }

  onNewModel() {
    this.router.navigateByUrl("/models/add");
  }

  onDeleteModel(id: number) {
    if (confirm("Voulez vraiment supprimer ce model ?")){
      this.modelsService.removeModel(id);
    }
  }

}

import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatGridListModule } from '@angular/material/grid-list';
import {MatTooltipModule} from '@angular/material/tooltip';

@NgModule({
    imports: [
        MatToolbarModule,
        MatGridListModule,
        MatTooltipModule
    ],
    exports: [
        MatToolbarModule,
        MatGridListModule,
        MatTooltipModule
    ]
})
export class MaterialModule {}

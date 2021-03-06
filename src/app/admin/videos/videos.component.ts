import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { VideoService } from './video.service';
import { MatDialog } from '@angular/material';
import { VideoUploadComponent } from './video-upload/video-upload.component';

@Component({
  selector: 'videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss']
})
export class VideosComponent implements OnInit {
  public videos: Observable<any>;
  public page = 0;
  public resultCount = 10;
  public pageSizeOptions = [1, 5, 10, 25, 50, 100];
  public searchTerm: string;

  @ViewChild('myVideo') myVideo: any;
  played: boolean;
  constructor(
    public service: VideoService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.videos = this.service.getAllVideos(this.page, this.resultCount);
  }

  public searchVideos(searchTerm) {
    this.searchTerm = searchTerm.value;
    this.videos = this.service.getAllVideos(this.page, this.resultCount, this.searchTerm);
  }

  public nextPage(pageEvent) {
    this.page = pageEvent.pageIndex;
    this.resultCount = pageEvent.pageSize;
    this.videos = this.service.getAllVideos(this.page, this.resultCount, this.searchTerm);
  }

  public openDialog(event): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(VideoUploadComponent, {});
  }
}

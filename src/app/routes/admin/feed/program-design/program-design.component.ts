import { Component, OnInit } from '@angular/core';
import { AdminService } from './../../admin.service';
import { VideoService } from './../../videos/video.service';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'program-design',
  templateUrl: './program-design.component.html',
  styleUrls: ['./program-design.component.scss']
})
export class ProgramDesignComponent implements OnInit {
  public request: Observable<any>;
  public videos: Observable<any>;
  private programVideos: string[] = new Array<string>();
  public requestId: string;
  public videoPage: number = 0;
  public videoResultCount: number = 10;

  constructor(
    private service: AdminService,
    private videoService: VideoService,
    public route: ActivatedRoute,
    public router: Router
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.requestId = params['id'];
      this.request = this.service.getRequestDetails(this.requestId);
    });
    this.videos = this.videoService.getAllVideos(this.videoPage, this.videoResultCount);
  }

  public addToProgram(videoId) {
    this.programVideos.push(videoId);
  }

  public searchVideos(searchTerm) {
    this.videos = this.videoService.getAllVideos(this.videoPage, this.videoResultCount, searchTerm.value);
  }

  public checkIfAdded(videoId) {
    let notAdded = true;
    this.programVideos.forEach(function(id) {
      if(id === videoId) {
        notAdded = false;
      }
    });
    return notAdded;
  }

  public async createProgram() {
    this.request.subscribe((data) => {
      let program = {
        videos: this.programVideos,
        client: data.request.client,
        expiration: data.request.unixExpiration,
        description: null,
        jobTitle: data.request.jobTitle,
      }
      this.service.makeProgram(program, this.requestId).subscribe((result) => {
        this.router.navigateByUrl('/');
      })
    });
  }

}

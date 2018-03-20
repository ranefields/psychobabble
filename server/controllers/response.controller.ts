import { fixThis } from './../utility/fix-this';
import { reqRequire } from './../utility/req-require';
import { ResponseService } from './../services/response.service';
import { UserService } from './../services/user.service';
import { VideoService } from './../services/video.service';
import { ProgramService } from './../services/program.service';
import { RoleType } from './../models/Role';

export interface ResponseControllerDependencies {
  responseService: ResponseService;
  userService: UserService;
  videoService: VideoService;
  programService: ProgramService;
}

export class ResponseController {
  private responseService: ResponseService;
  private userService: UserService;
  private videoService: VideoService;
  private programService: ProgramService;

  constructor(dependencies: ResponseControllerDependencies = null) {
    this.responseService = dependencies ? dependencies.responseService : new ResponseService();
    this.userService = dependencies ? dependencies.userService : new UserService();
    this.videoService = dependencies ? dependencies.videoService : new VideoService();
    this.programService = dependencies ? dependencies.programService : new ProgramService();
    fixThis(this, ResponseController);
  }

  public async beginResponseProcess(req, res) {
    try {
      if(!reqRequire(req, res,
        ['jwt', 401, "Missing auth token",
          ['id', 400, "Malformed auth token"],
          ['role', 400, "Malformed auth token"]],
        ['body', 400, "Request body missing",
          ['videoId', 400, "Missing 'videoId' in request body"],
          ['programId', 400, "Missing 'programId' in request body"]]
      )) { return; }
      if (req.jwt.role !== RoleType.Subject) {
        res.status(401);
        res.json({
          message: "Unauthorized"
        });
        return;
      }
      let subject = await this.userService.repo.findOneById(req.jwt.id);
      if (!subject) { throw new Error("User does not exist!"); }
      let video = await this.videoService.repo.findOneById(req.body.videoId);
      if (!video) { throw new Error("Video does not exist!"); }
      let program = await this.programService.repo.findOneById(req.body.programId);
      if (!program) { throw new Error("Program does not exist!"); }
      let newResponse = await this.responseService.saveNewAsync({
        audio_url: null,
        subject: subject,
        video: video,
        program: program,
      });
      if (!newResponse) { throw new Error("Could not create new response object"); }
      res.status(200);
      res.json({
        message: "New response initialized",
        responseId: newResponse.id
      });
      return;
    }
    catch (err) {
      console.logDev(err);
      res.status(500);
      res.json({
        message: "Unknown error"
      });
      return;
    }
  }

  public async generateAudioUrl(req, res) {
    try {
      if(!reqRequire(req, res,
        ['jwt', 401, "Missing auth token",
          ['id', 400, "Malformed auth token"],
          ['role', 400, "Malformed auth token"]],
        ['query', 400, "Request body missing",
          ['responseId', 400, "Missing 'responseId' in request query params"]]
      )) { return; }
      if (req.jwt.role !== RoleType.Subject) {
        res.status(401);
        res.json({
          message: "Unauthorized"
        });
        return;
      }
      let response = await this.responseService.repo.findOneById(req.query.responseId, {relations: ['subject']});
      if (!response) { throw new Error("Response does not exist!"); }
      let awsParams = {
        ACL: "public-read",
        Bucket: process.env.S3_BUCKET_NAME,
        ContentType: 'audio/wav',
        Expires: 100,
        Key: `subjects/${response.subject.id}/audio/${response.id}.wav`,
      };
      let signedUrl = await this.responseService.generateAudioUrlAsync(response, awsParams);
      if (!signedUrl) { throw new Error("Could not generate signed URL"); }
      res.status(200);
      res.json({
        message: "Audio url generated successfully",
        response: {
          id: response.id,
          audioUrl: response.audio_url
        },
        aws: {
          signedUrl: signedUrl,
          acl: awsParams.ACL,
          bucket: awsParams.Bucket,
          key: awsParams.Key,
          contentType: awsParams.ContentType
        }
      });
      return;
    }
    catch (err) {
      console.logDev(err);
      res.status(500);
      res.json({
        message: "Unknown error"
      });
      return;
    }
  }
}

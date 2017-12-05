namespace sczCore
{
  export class Game
  {
    protected eventBus: EventBus;
    protected engine: Engine;
    protected entities: Map<number, Entity>;
    protected scenes: Map<number, Scene>;

    public constructor(eventBus?: EventBus)
    {
      if(eventBus == null)
      {
        eventBus = new EventBus();
      }

      this.eventBus = eventBus;
      this.engine = new Engine(this.eventBus);
      this.entities = new Map<number, Entity>();
      this.scenes = new Map<number, Scene>();
    }

    public getEventBus(): EventBus
    {
      return this.eventBus;
    }

    public addEntity(entity: Entity): void
    {
      if(entity == null)
      {
        throw new Error("entity cannot be null");
      }

      if(this.hasEntity(entity.getId()))
      {
        throw new Error("an entity with this id has already been registered");
      }

      this.entities.set(entity.getId(), entity);
    }

    public hasEntity(entityId: number): boolean
    {
      return this.entities.has(entityId);
    }

    public getEntity(entityId: number): Entity
    {
      if(!this.hasEntity(entityId))
      {
        throw new Error(`entity [${entityId}] not registered`);
      }

      return this.entities.get(entityId);
    }

    public removeEntity(entityId: number): void
    {
      if(!this.hasEntity(entityId))
      {
        throw new Error(`no entity registered with id ${entityId}`);
      }

      this.entities.delete(entityId);
    }

    public addScene(scene: Scene): void
    {
      if(scene == null)
      {
        throw new Error("scene cannot be null");
      }

      if(this.hasScene(scene.getId()))
      {
        throw new Error("a scene with this id has already been registered");
      }

      this.scenes.set(scene.getId(), scene);
    }

    public hasScene(scenesId: number): boolean
    {
      return this.scenes.has(scenesId);
    }

    public getScene(sceneid: number): Scene
    {
      if(!this.hasScene(sceneid))
      {
        throw new Error(`scene [${sceneid}] not registered`);
      }

      return this.scenes.get(sceneid);
    }

    public removeScene(scenesId: number): void
    {
      if(!this.hasScene(scenesId))
      {
        throw new Error(`no scene registered with id ${scenesId}`);
      }

      this.scenes.delete(scenesId);
    }

    public addSystem(sceneId: number, system: System): void
    {
      if(!this.hasScene(sceneId))
      {
        throw new Error("there is no system registered with that id");
      }

      if(system == null)
      {
        throw new Error("system cannot be null");
      }

      this.getScene(sceneId).addSystem(system);
    }

    public registerEntity(
      sceneId: number, systemType: Function, entityId: number): void
    {
      if(!this.hasEntity(entityId))
      {
        throw new Error("there is no entity registered with that id");
      }

      let entity = this.getEntity(entityId);

      if(!this.hasScene(sceneId))
      {
        throw new Error("there is no system registered with that id");
      }

      let scene = this.getScene(sceneId);

      if(!scene.hasSystem(systemType))
      {
        throw new Error("this scene has no such system registered");
      }

      let system: System = scene.getSystem(systemType);

      system.registerEntity(entity);
    }

    public activateScene(sceneId: number): void
    {
      this.eventBus.publish(
        EngineEvent.SceneChange, [sceneId, SceneAction.Activate]);
    }

    public deactivateScene(sceneId: number): void
    {
      this.eventBus.publish(
        EngineEvent.SceneChange, [sceneId, SceneAction.Deactivate]);
    }

    public start(): void
    {
        this.engine.start();
    }

    public stop(): void
    {
      this.engine.stop();
    }
  }
}

import { ClassConstructor, plainToInstance } from 'class-transformer';

export abstract class BaseMapper<TDto, TEntity> {
  public abstract toDto(entity: TEntity): TDto;
  public abstract toEntity(dto: TDto): TEntity;

  mapToEntity(dto: TDto, entityClass: ClassConstructor<TEntity>): TEntity {
    return plainToInstance(entityClass, dto);
  }

  mapToDto(entity: TEntity, dtoCalss: ClassConstructor<TDto>): TDto {
    return plainToInstance(dtoCalss, entity);
  }
}

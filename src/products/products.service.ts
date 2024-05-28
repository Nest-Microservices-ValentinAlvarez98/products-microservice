import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger('ProductsService')

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Connected to the database');
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {

    const product = await this.product.create({
      data: createProductDto
    });

    return product;

  }

  async findAll(paginationDto: PaginationDto) {

    const { page, limit } = paginationDto;

    const totalProducts = await this.product.count({ where: { available: true } });
    const lastPage = Math.ceil(totalProducts / limit);

    if (page > lastPage) throw new NotFoundException(`Page ${page} not found`);

    return {
      data: await this.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: { available: true }
      }),
      meta: {
        totalProducts,
        page,
        lastPage,
      }
    }

  }

  async findOne(id: number): Promise<Product> {

    const product = await this.product.findUnique({
      where: {
        id,
        available: true
      }
    });

    if (!product) throw new NotFoundException(`Product with id ${id} not found`);

    return product;

  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {

    const { id: __, ...data } = updateProductDto;

    if (!updateProductDto.name && !updateProductDto.price) throw new BadRequestException('Nothing to update');

    await this.findOne(id);

    const newProduct = await this.product.update({
      where: { id },
      data
    })

    return newProduct;

  }

  async remove(id: number) {

    await this.findOne(id);

    // Esto es un hard delete y puede generar un problema en cascada en los microservicios
    /* const result = await this.product.delete({
      where: { id }
    });
     
    return result; */

    const product = await this.product.update({
      where: { id },
      data: {
        available: false
      }
    })

    return product;


  }

}

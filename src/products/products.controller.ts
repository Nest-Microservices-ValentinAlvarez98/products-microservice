import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  // @Post()
  @MessagePattern({
    cmd: 'create_product'
  })
  async create(@Payload() createProductDto: CreateProductDto) {

    try {

      return await this.productsService.create(createProductDto);

    } catch (error) {

      throw new RpcException(error)

    }

  }

  //@Get()
  @MessagePattern({
    cmd: 'find_all_products'
  })
  async findAll(@Payload() paginationDto: PaginationDto) {

    try {

      return await this.productsService.findAll(paginationDto);

    } catch (error) {

      throw new RpcException(error)

    }

  }


  //@Get(':id')
  @MessagePattern({
    cmd: 'find_product_by_id'
  })
  async findOne(@Payload('id', ParseIntPipe) id: number) { // Le estaria diciendo al payload que el id es un parametro, que lo extraiga de ahi y lo parse a entero

    try {

      return await this.productsService.findOne(id);

    } catch (error) {

      throw new RpcException(error)

    }

  }

  //@Patch(':id')
  @MessagePattern({
    cmd: 'update_product'
  })
  async update(
    /* @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto */
    @Payload('id', ParseIntPipe) id: number,
    @Payload() updateProductDto: UpdateProductDto
  ) {

    try {

      return await this.productsService.update(id, updateProductDto);

    } catch (error) {

      throw new RpcException(error)

    }

  }

  // @Delete(':id')
  @MessagePattern({
    cmd: 'remove_product'
  })
  async remove(@Payload('id', ParseIntPipe) id: number) {

    try {

      return await this.productsService.remove(id);

    } catch (error) {

      throw new RpcException(error)

    }

  }
}

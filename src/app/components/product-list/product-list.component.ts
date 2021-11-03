import { Product } from './../../models/Product';
import { ProductService } from './../../services/product.service';
import { Component, OnInit, Input } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  produtos: Product[] = [];

  @Input() produtoSelecionado!: Product;

  @Input() produtoEditando!:any;

  viewDetails = false;
  viewEdit =false;
  public produtosExibidos: Product[] = [];

  constructor(
    private service: ProductService,
    teste: MatPaginatorIntl,
    private router: Router
  ) {
    this.getProducts();
    teste.nextPageLabel = 'Proxima pagina';
    teste.itemsPerPageLabel = 'Itens por pagina';
    teste.previousPageLabel = 'Pagina anterior';
  }

  getProducts() {
    this.service.getProducts().subscribe((produtos: Product[]) => {
      this.produtos = produtos;
      this.produtos.map((a) => (a.quantidade = 1));
      console.log(produtos);
      this.atualizarProdutosExibidos();
    });
  }
  ngOnInit(): void {
    this.service.onProdutosMudaram.subscribe(() => {
      this.getProducts();
    });
  }

  showDetails(produto: Product) {
    this.viewDetails = true;
    this.produtoSelecionado = produto;
  }

  closeDetails() {
    this.viewDetails = false;
  }

  atualizarPagina() {
    this.service.onProdutosMudaram.emit();
  }

  atualizarProdutosExibidos() {
    this.produtosExibidos = this.produtos.slice(0, 6);
  }
  OnPageChange(event: PageEvent) {
    const startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;
    if (endIndex > this.produtos.length) {
      endIndex = this.produtos.length;
    }
    this.produtosExibidos = this.produtos.slice(startIndex, endIndex);
  }

  update(produto:Product) {
    this.produtoEditando = produto;
    this.viewEdit= true;
  }
  closeUpdate(){
    this.viewEdit= false;
    this.atualizarPagina();

  }
}

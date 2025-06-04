from django.db import models
from imagekit.models import ProcessedImageField


class AboutMain(models.Model):
    cnt_people = models.CharField(max_length=50, verbose_name='Кол-во человек в команде')
    cnt_year = models.CharField(max_length=50, verbose_name='Кол-во лет работы в сфере')
    cnt_square = models.CharField(max_length=50, verbose_name='Кол-во кв.метров чистки')

    class Meta:
        verbose_name = 'О нас на главном экране'
        verbose_name_plural = 'О нас на главном экране'

    def __str__(self):
        return f'{self.cnt_people} | {self.cnt_year} | {self.cnt_square}'


class ScopeServices(models.Model):
    name = models.CharField(max_length=250, verbose_name='Название сферы услуг')

    class Meta:
        verbose_name = 'Сфера услуг'
        verbose_name_plural = 'Сферы услуг'

    def __str__(self):
        return self.name


class Services(models.Model):
    scope = models.ForeignKey(ScopeServices, on_delete=models.CASCADE, verbose_name='Сфера')
    desc = models.TextField(verbose_name='Описание')
    price = models.DecimalField(max_digits=12, decimal_places=2, verbose_name='Цена')
    time_work = models.CharField(max_length=150, verbose_name='Часы работы')
    square = models.CharField(max_length=150, verbose_name='Площадь работы')
    photo = ProcessedImageField(
        upload_to='services',
        format='WEBP',
        options={'quality': 80},
        verbose_name='Фото'
    )

    class Meta:
        verbose_name = 'Услуга'
        verbose_name_plural = 'Услуги'

    def __str__(self):
        return self.scope.name


class OrderInfo(models.Model):
    cnt_order = models.IntegerField(verbose_name='Кол-во выполненных заказов')

    class Meta:
        verbose_name = 'Информация о заказе'
        verbose_name_plural = 'Информация о заказах'

    def __str__(self):
        return f'Кол-во выполненных заказов: {self.cnt_order}'


class Order(models.Model):
    scope = models.ForeignKey(ScopeServices, on_delete=models.CASCADE, verbose_name='Сфера')
    entity = models.CharField(max_length=150, verbose_name='Сущность', help_text='Например, юр.лицо или физ.лицо')
    square = models.CharField(max_length=150, verbose_name='Площадь работы')
    photo = ProcessedImageField(
        upload_to='orders',
        format='WEBP',
        options={'quality': 80},
        verbose_name='Фото'
    )

    class Meta:
        verbose_name = 'Заказ'
        verbose_name_plural = 'Заказы'

    def __str__(self):
        return self.scope.name


class QuestionAnswer(models.Model):
    question = models.TextField(verbose_name='Вопрос')
    answer = models.TextField(verbose_name='Ответ')

    class Meta:
        verbose_name = 'Вопрос-Ответ'
        verbose_name_plural = 'Вопросы-Ответы'

    def __str__(self):
        return f'{self.question} - {self.answer}'


class Contact(models.Model):
    phone = models.CharField(max_length=50, verbose_name='Телефон')
    address = models.TextField(verbose_name='Адрес')

    class Meta:
        verbose_name = 'Контактная информация'
        verbose_name_plural = 'Контактная информация'

    def __str__(self):
        return self.address


class Feedback(models.Model):
    name = models.CharField(max_length=250, verbose_name='Имя')
    phone = models.CharField(max_length=50, verbose_name='Телефон')
    square = models.CharField(max_length=250, verbose_name='Квадратура', null=True, blank=True)
    scope = models.CharField(max_length=250, verbose_name='Сфера услуг')
    message = models.TextField(verbose_name='Сообщение/вопрос', null=True, blank=True)

    class Meta:
        verbose_name = 'Заявка'
        verbose_name_plural = 'Заявки'

    def __str__(self):
        return f'{self.name} | {self.phone}'


class VideoMain(models.Model):
    name = models.TextField(verbose_name='Заголовок к видео')
    video = models.FileField(upload_to='videos')

    class Meta:
        verbose_name = 'Видео на главном экране'
        verbose_name_plural = 'Видео на главном экране'

    def __str__(self):
        return self.name


class PriceServices(models.Model):
    scope = models.ForeignKey(ScopeServices, on_delete=models.CASCADE, verbose_name='Сфера')
    square = models.IntegerField(verbose_name='Площадь работы')
    price = models.DecimalField(max_digits=12, decimal_places=2, verbose_name='Цена')

    class Meta:
        verbose_name = 'Цена услуг'
        verbose_name_plural = 'Цены услуг'

    def __str__(self):
        return f'{self.scope.name} - {self.price}'

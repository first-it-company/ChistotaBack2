from django.db import models
from django.urls import reverse
from imagekit.models import ProcessedImageField
from slugify import slugify


class AboutMain(models.Model):
    cnt_people = models.CharField(
        max_length=50, verbose_name="Кол-во человек в команде"
    )
    cnt_year = models.CharField(max_length=50, verbose_name="Кол-во лет работы в сфере")
    cnt_square = models.CharField(max_length=50, verbose_name="Кол-во кв.метров чистки")

    class Meta:
        verbose_name = "О нас на главном экране"
        verbose_name_plural = "О нас на главном экране"

    def __str__(self):
        return f"{self.cnt_people} | {self.cnt_year} | {self.cnt_square}"


class ScopeServices(models.Model):
    name = models.CharField(max_length=250, verbose_name="Название сферы услуг")

    class Meta:
        verbose_name = "Сфера услуг"
        verbose_name_plural = "Сферы услуг"

    def __str__(self):
        return self.name


class ServicePhoto(models.Model):
    photo = ProcessedImageField(
        upload_to="services",
        format="WEBP",
        options={"quality": 80},
        verbose_name="Фото",
    )

    class Meta:
        verbose_name = "Фотография услуги"
        verbose_name_plural = "Фотографии услуг"


class Services(models.Model):
    scope = models.ForeignKey(
        ScopeServices, on_delete=models.CASCADE, verbose_name="Сфера"
    )
    slug = models.SlugField(max_length=255, unique=True, db_index=True, verbose_name="URL")
    desc = models.TextField(verbose_name="Описание")
    color = models.CharField(max_length=50, verbose_name="Цвет)")
    gradient = models.TextField(
        verbose_name="Градиент (linear-gradient(0deg, #53647A, #53647A), rgba(83, 100, 122, 0.4) 55%, rgba(0, 96, 223, 0.4) 100%);)"
    )
    time_work = models.CharField(max_length=150, verbose_name="Часы работы")
    square = models.CharField(max_length=150, verbose_name="Площадь работы")
    order = models.IntegerField(verbose_name="порядок")
    photos = models.ManyToManyField(ServicePhoto, verbose_name="Фотографии")

    class Meta:
        verbose_name = "Услуга"
        verbose_name_plural = "Услуги"

    def __str__(self):
        return self.scope.name

    def get_absolute_url(self):
        return reverse("service_detail", kwargs={"slug": self.slug})

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.scope.name)
            slug = base_slug
            counter = 1
            qs = Services.objects.all()
            if self.pk:
                qs = qs.exclude(pk=self.pk)
            while qs.filter(slug=slug).exists():
                slug = f'{base_slug}-{counter}'
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)


class ServiceInclusion(models.Model):
    service = models.ForeignKey(
        Services,
        related_name="inclusions",
        on_delete=models.CASCADE,
        verbose_name="Услуга",
    )
    header = models.CharField(max_length=255, verbose_name="Заголовок")
    description = models.TextField(verbose_name="Описание")

    class Meta:
        verbose_name = "Что входит в услугу"
        verbose_name_plural = "Что входит в услугу"

    def __str__(self):
        return self.header


class OrderInfo(models.Model):
    cnt_order = models.IntegerField(verbose_name="Кол-во выполненных заказов")

    class Meta:
        verbose_name = "Информация о заказе"
        verbose_name_plural = "Информация о заказах"

    def __str__(self):
        return f"Кол-во выполненных заказов: {self.cnt_order}"


class Order(models.Model):
    scope = models.ForeignKey(
        ScopeServices, on_delete=models.CASCADE, verbose_name="Сфера"
    )
    entity = models.CharField(
        max_length=150,
        verbose_name="Сущность",
        help_text="Например, юр.лицо или физ.лицо",
    )
    square = models.CharField(max_length=150, verbose_name="Площадь работы")
    photo = ProcessedImageField(
        upload_to="orders", format="WEBP", options={"quality": 80}, verbose_name="Фото"
    )

    class Meta:
        verbose_name = "Заказ"
        verbose_name_plural = "Заказы"

    def __str__(self):
        return self.scope.name


class QuestionAnswer(models.Model):
    question = models.TextField(verbose_name="Вопрос")
    answer = models.TextField(verbose_name="Ответ")

    class Meta:
        verbose_name = "Вопрос-Ответ"
        verbose_name_plural = "Вопросы-Ответы"

    def __str__(self):
        return f"{self.question} - {self.answer}"


class Contact(models.Model):
    phone = models.CharField(max_length=50, verbose_name="Телефон", blank=True)
    city = models.CharField(max_length=100, verbose_name="Город", blank=True)
    address = models.CharField(max_length=255, verbose_name="Адрес", blank=True)
    work_schedule = models.CharField(
        max_length=255, verbose_name="График работы", blank=True
    )
    email = models.EmailField(verbose_name="Электронная почта", blank=True)

    class Meta:
        verbose_name = "Контактная информация"
        verbose_name_plural = "Контактная информация"

    def __str__(self):
        return self.address


class CompanyDetails(models.Model):
    calc_account = models.CharField(
        max_length=100, verbose_name="Расчётный счёт", blank=True
    )
    TIN = models.CharField(max_length=100, verbose_name="ИНН", blank=True)
    bank = models.CharField(max_length=100, verbose_name="Название Банка", blank=True)
    BIC = models.CharField(max_length=100, verbose_name="БИК", blank=True)
    correspondent_account = models.CharField(
        max_length=100, verbose_name="Корреспондентский счёт", blank=True
    )
    name = models.CharField(max_length=100, verbose_name="Наименование", blank=True)

    class Meta:
        verbose_name = "Реквизиты"
        verbose_name_plural = "Реквизиты"

    def __str__(self):
        return self.name


class Feedback(models.Model):
    name = models.CharField(max_length=250, verbose_name="Имя")
    phone = models.CharField(max_length=50, verbose_name="Телефон")
    message = models.TextField(verbose_name="Сообщение/вопрос", null=True, blank=True)

    class Meta:
        verbose_name = "Заявка"
        verbose_name_plural = "Заявки"

    def __str__(self):
        return f"{self.name} | {self.phone}"


class VideoMain(models.Model):
    name = models.TextField(verbose_name="Заголовок к видео")
    video = models.FileField(upload_to="videos")

    class Meta:
        verbose_name = "Видео на главном экране"
        verbose_name_plural = "Видео на главном экране"

    def __str__(self):
        return self.name


class Employee(models.Model):
    photo = ProcessedImageField(
        upload_to="employee",
        format="WEBP",
        options={"quality": 80},
        verbose_name="Фото",
    )
    name = models.TextField(verbose_name="ФИО")
    position = models.CharField(max_length=500, verbose_name="Должность")
    description = models.TextField(blank=True, verbose_name="Описание")
    experience = models.PositiveSmallIntegerField(
        blank=True, null=True, verbose_name="Стаж"
    )

    class Meta:
        verbose_name = "Сотрудник компании"
        verbose_name_plural = "Сотрудники компании"

    def __str__(self):
        return self.name


class Logo(models.Model):
    photo = ProcessedImageField(
        upload_to="logo", format="WEBP", options={"quality": 80}, verbose_name="Лого"
    )

    class Meta:
        verbose_name = "Лого для блока Нас Выбирают"
        verbose_name_plural = "Лого для блока Нас Выбирают"


class SocialNetwork(models.Model):
    name = models.CharField(max_length=100, verbose_name="Название соцсети")
    url = models.URLField(verbose_name="Ссылка на соцсеть", null=True, blank=True)

    class Meta:
        verbose_name = "Социальная сеть"
        verbose_name_plural = "Социальные сети"

    def __str__(self):
        return self.name

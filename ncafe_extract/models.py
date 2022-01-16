from django.db import models
from django.db import connection

# Create your models here.
class procedures():
    def USP_QRY_NVCAFE_LIST(self, rowcnt, userid):
        cursor = connection.cursor()
        ret = cursor.execute("{EXEC USP_QRY_NVCAFE_LIST (@PVC_QRY_CNT=?, @PVC_USER_ID=?)}", (rowcnt, userid))
        cursor.close()
        return ret

class NcafeList(models.Model):
    cafe_id = models.IntegerField(primary_key=True)
    cafe_name = models.CharField(max_length=64)
    updt_dt = models.DateTimeField()
    post_cnt = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ncafe_list'